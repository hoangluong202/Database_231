import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function filterAndSortCourse() {
    await pool.query(`
    CREATE OR REPLACE FUNCTION filter_and_sort_course(
        p_instructor_id INTEGER,
        p_course_labels VARCHAR(100)[] DEFAULT NULL,
        p_audience_labels VARCHAR(100)[] DEFAULT NULL,
        p_sponsor_names VARCHAR(100)[] DEFAULT NULL,
        p_sort_columns VARCHAR(100)[] DEFAULT ARRAY['updatedAt'],
        p_sort_orders VARCHAR(4)[] DEFAULT ARRAY['DESC'],
        p_min_average_rating NUMERIC(2, 1) DEFAULT NULL
    ) RETURNS TABLE (
        "courseId" INTEGER,
        "courseName" VARCHAR(100),
        "courseLabel" "CourseLabel",
        "audienceLabel" "AudienceLabel",
        "updatedAt" TIMESTAMP(3),
        "totalDuration" INTEGER,
        "sponsorName" VARCHAR(100),
        "priceDiscounted" INTEGER,
        "averageRating" NUMERIC(2,1)
    ) AS $$
    DECLARE
        valid_course_labels VARCHAR[] := ARRAY['Bestseller', 'HotAndNew', 'New', 'HighestRated'];
        valid_audience_labels VARCHAR[] := ARRAY['Beginner', 'Intermediate', 'Expert', 'AllLevels'];
        valid_sort_columns VARCHAR(100)[] := ARRAY['name', 'updatedAt', 'totalDuration', 'priceDiscounted', 'averageRating'];
        valid_sort_orders VARCHAR(4)[] := ARRAY['ASC', 'DESC', 'asc', 'desc'];
        order_clause TEXT := '';
        i INTEGER;

    BEGIN
        IF p_instructor_id IS NULL THEN
            RAISE EXCEPTION 'Giáo viên không được để trống !';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM "Instructor" WHERE "userId" = p_instructor_id) THEN
            RAISE EXCEPTION 'Giáo viên không tồn tại !';
        END IF;

        IF p_course_labels IS NOT NULL AND EXISTS (
            SELECT 1 FROM UNNEST(p_course_labels) AS elem WHERE elem NOT IN (SELECT UNNEST(valid_course_labels))
        ) THEN
            RAISE EXCEPTION 'Nhãn khóa học không hợp lệ !';
        END IF;

        IF p_audience_labels IS NOT NULL AND EXISTS (
            SELECT 1 FROM UNNEST(p_audience_labels) AS elem WHERE elem NOT IN (SELECT UNNEST(valid_audience_labels))
        ) THEN
            RAISE EXCEPTION 'Nhãn người học không hợp lệ !';
        END IF;

        IF p_sort_columns IS NOT NULL AND EXISTS (
            SELECT 1 FROM UNNEST(p_sort_columns) AS elem WHERE elem NOT IN (SELECT UNNEST(valid_sort_columns))
        ) THEN
            RAISE EXCEPTION 'Các tiêu chí sắp xếp không hợp lệ !';
        END IF;

        IF p_sort_orders IS NOT NULL AND EXISTS (
            SELECT 1 FROM UNNEST(p_sort_orders) AS elem WHERE elem NOT IN (SELECT UNNEST(valid_sort_orders))
        ) THEN
            RAISE EXCEPTION 'Thứ tự sắp xếp không hợp lệ !';
        END IF;

        IF ARRAY_LENGTH(p_sort_columns, 1) IS DISTINCT FROM ARRAY_LENGTH(p_sort_orders, 1) THEN
            RAISE EXCEPTION 'Số lượng tiêu chí sắp xếp không bằng số lượng thứ tự sắp xếp !';
        END IF;

        FOR i IN 1..ARRAY_LENGTH(p_sort_columns, 1) LOOP
            IF i > 1 THEN
                order_clause := order_clause || ', ';
            END IF;
            order_clause := order_clause || QUOTE_IDENT(p_sort_columns[i]) || ' ' || p_sort_orders[i];
        END LOOP;

        RETURN QUERY
        SELECT
            c.id AS "courseId",
            c.name AS "courseName",
            c."courseLabel",
            c."audienceLabel",
            c."updatedAt",
            c."totalDuration",
            CASE
                WHEN fc."courseId" IS NOT NULL THEN fc."sponsorName"
                ELSE NULL
            END AS "sponsorName",
            CASE
                WHEN pc."courseId" IS NOT NULL THEN pc."priceDiscounted"
                ELSE NULL
            END AS "priceDiscounted",
            ROUND(COALESCE(AVG(src."rating"), 0),1 )AS "averageRating"
        FROM
            "Course" AS c
            LEFT JOIN "FreeCourse" AS fc ON c."id" = fc."courseId"
            LEFT JOIN "PaidCourse" AS pc ON c."id" = pc."courseId"
            LEFT JOIN "StudentReviewCourse" AS src ON c."id" = src."courseId"
        WHERE
            c."instructorId" = p_instructor_id
            AND (p_course_labels IS NULL OR c."courseLabel" = ANY(p_course_labels::"CourseLabel"[]))
            AND (p_audience_labels IS NULL OR c."audienceLabel" = ANY(p_audience_labels::"AudienceLabel"[]))
            AND (p_sponsor_names IS NULL OR fc."sponsorName" = ANY(p_sponsor_names))
        GROUP BY 
            c.id,
            c.name,
            c."courseLabel",
            c."audienceLabel",
            c."updatedAt",
            c."totalDuration",
            fc."courseId",
            pc."courseId"
        HAVING
            COALESCE(AVG(src."rating"), 0) >= COALESCE(p_min_average_rating, COALESCE(AVG(src."rating"), 0), 0)
        ORDER BY
            CASE
                WHEN order_clause = '' THEN "averageRating"
                ELSE order_clause
            END;
    END;
    $$ LANGUAGE plpgsql;
    `);

    process.exit(0);
}

filterAndSortCourse();
