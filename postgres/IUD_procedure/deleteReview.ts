import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function deleteReview() {
    await pool.query(`
        CREATE OR REPLACE PROCEDURE delete_review(
            p_student_id INTEGER,
            p_course_id INTEGER
        ) AS $$
        BEGIN
        IF NOT EXISTS (SELECT 1 FROM "Student" WHERE "userId" = p_student_id) THEN
            RAISE EXCEPTION 'Không tìm thấy học sinh !';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM "Course" WHERE "id" = p_course_id) THEN
            RAISE EXCEPTION 'Không tìm thấy khóa học !';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM "StudentReviewCourse" WHERE "studentId" = p_student_id AND "courseId" = p_course_id) THEN
            RAISE EXCEPTION 'Không tìm thấy review của học sinh này trong khóa học !';
        END IF;

        DELETE 
            FROM "StudentReviewCourse"
        WHERE 
            "studentId" = p_student_id 
            AND "courseId" = p_course_id;
        END;
        $$ LANGUAGE plpgsql;
    `);
}

deleteReview();
