import { FilterSearchCourseDto } from '@be/dtos/in';
import { CourseDto, CourseTopDto } from '@be/dtos/out';
import { logger, poolQuery } from '@be/utils';
import { faker } from '@faker-js/faker';

const getCoursesByStudentId = async (studentId: number): Promise<CourseDto[]> => {
    try {
        const queryText = `
        SELECT c."id" AS "courseId",
              c.name,
              pc."priceDiscounted" AS price,
              fc."sponsorName" AS sponsor,
              c.description,
              CASE WHEN src."courseId" IS NOT NULL THEN true ELSE false END AS "isReviewed"
        FROM "Course" c
        LEFT JOIN "FreeCourse" fc ON c."id" = fc."courseId"
        LEFT JOIN "PaidCourse" pc ON c."id" = pc."courseId"
        LEFT JOIN "StudentReviewCourse" src ON c."id" = src."courseId"
        WHERE c."id" IN
            (SELECT srfc."courseId" AS id
            FROM "Student" s
            JOIN "StudentRegisterFreeCourse" srfc ON s."userId" = srfc."studentId"
            WHERE s."userId" = $1
            UNION SELECT pco."paidCourseId" AS id
            FROM "Student" s
            JOIN "Order" o ON s."userId" = o."studentId"
            JOIN "PaidCourseOrder" pco ON o."id" = pco."orderId"
            WHERE s."userId" = $1 );
        `;
        const { rows } = await poolQuery({ text: queryText, values: [studentId] });
        rows.forEach((row) => {
            row.image = faker.image.url();
        });
        return rows;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

const getTopCourses = async (instructorId: number): Promise<CourseTopDto[]> => {
    try {
        const queryText = `SELECT * FROM get_top_course($1);`;
        const { rows } = await poolQuery({ text: queryText, values: [instructorId] });
        return rows;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

const filterAndSortCourse = async (instructorId: number, queryFilterAndSort: FilterSearchCourseDto): Promise<CourseTopDto[]> => {
    try {
        const { courseLabels, audienceLabels, sponsorName, sortColumns, sortOrders, minAverageRating } = queryFilterAndSort;
        const validSortColumns = sortColumns ? sortColumns : ['updatedAt'];
        const validSortOrders = sortOrders ? sortOrders : ['DESC'];
        const queryText = `SELECT * FROM filter_and_sort_course($1,$2,$3,$4,$5,$6,$7);`;
        const { rows } = await poolQuery({
            text: queryText,
            values: [instructorId, courseLabels, audienceLabels, sponsorName, validSortColumns, validSortOrders, minAverageRating]
        });
        return rows;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const courseQuery = { getCoursesByStudentId, getTopCourses, filterAndSortCourse };
