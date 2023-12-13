import { CourseDto } from '@be/dtos/out';
import { logger, poolQuery } from '@be/utils';
import { faker } from '@faker-js/faker';

const getCoursesByStudentId = async (studentId: number): Promise<CourseDto[]> => {
    try {
        //add column check is course is review by student
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
        logger.error('Error when retrieving user data by Sdt');
        logger.error(err);
        throw err;
    }
};

export const courseQuery = { getCoursesByStudentId };
