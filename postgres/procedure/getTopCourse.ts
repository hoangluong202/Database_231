import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function getTopCourse() {
    await pool.query(`
        CREATE OR REPLACE FUNCTION get_top_course(p_instructor_id INTEGER) RETURNS TABLE(
            name VARCHAR(100),
            courseLabel "CourseLabel",
            audienceLabel "AudienceLabel",
            createdAt TIMESTAMP(3),
            updatedAt TIMESTAMP(3),
            totalDuration INTEGER,
            sponsorName VARCHAR(100),
            priceDiscounted INTEGER,
            averageRating NUMERIC(2,1)
        ) AS $$
        BEGIN
            IF p_instructor_id IS NULL THEN
                RAISE EXCEPTION 'Giáo viên không được để trống';
            END IF;

            IF NOT EXISTS (SELECT 1 FROM "Instructor" WHERE "userId" = p_instructor_id) THEN
                RAISE EXCEPTION 'Giáo viên không tồn tại';
            END IF;

            RETURN QUERY
            SELECT
                c."name",
                c."courseLabel",
                c."audienceLabel",
                c."createdAt",
                c."updatedAt",
                c."totalDuration",
                CASE
                    WHEN fc."courseId" IS NOT NULL THEN fc."sponsorName"
                    ELSE NULL
                END AS sponsorName,
                CASE
                    WHEN pc."courseId" IS NOT NULL THEN pc."priceDiscounted"
                    ELSE NULL
                END AS priceDiscounted,
                AVG(src."rating") AS averageRating
            FROM
                "Course" AS c
                LEFT JOIN "FreeCourse" AS fc ON c."id" = fc."courseId"
                LEFT JOIN "PaidCourse" AS pc ON c."id" = pc."courseId"
                LEFT JOIN "StudentReviewCourse" AS src ON c."id" = src."courseId"
            WHERE
                c."instructorId" = p_instructor_id
            GROUP BY 
                c."name",
                c."courseLabel",
                c."audienceLabel",
                c."createdAt",
                c."updatedAt",
                c."totalDuration",
                sponsorName,
                priceDiscounted
            ORDER BY
                averageRating DESC,
                c."updatedAt" DESC;
        END;
        $$ LANGUAGE plpgsql;
    `);
}

getTopCourse();
