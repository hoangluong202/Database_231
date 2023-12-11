import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function insertReview() {
    await pool.query(`
        CREATE OR REPLACE FUNCTION validate_review_parameters(
            p_student_id INTEGER,
            p_course_id INTEGER,
            p_rating INTEGER,
            p_content TEXT
        ) RETURNS TEXT AS $$
        BEGIN
            IF p_student_id IS NULL THEN
                RETURN 'Học sinh không được để trống';
            ELSIF p_course_id IS NULL THEN
                RETURN 'Khóa học không được để trống';
            ELSIF p_rating IS NULL THEN
                RETURN 'Điểm đánh giá không được để trống';
            ELSIF p_content IS NULL THEN
                RETURN 'Nội dung đánh giá không được để trống';
            END IF;
        
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
        CREATE OR REPLACE FUNCTION is_exist_student_or_course(_student_id INTEGER, _course_id INTEGER) RETURNS TEXT AS $$
        DECLARE
            student_exists BOOLEAN;
            course_exists BOOLEAN;
        BEGIN
            student_exists := EXISTS (
                SELECT 1
                FROM "Student"
                WHERE "userId" = _student_id
            );
        
            course_exists := EXISTS (
                SELECT 1
                FROM "Course"
                WHERE "id" = _course_id
            );

            IF NOT student_exists AND NOT course_exists THEN
                RETURN 'Không tồn tại học sinh và khóa học này';
            ELSIF NOT student_exists THEN
                RETURN 'Không tồn tại học sinh này';
            ELSIF NOT course_exists THEN
                RETURN 'Không tồn tại khóa học này';
            END IF;
    
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
        CREATE OR REPLACE FUNCTION is_course_registered(_student_id INTEGER, _course_id INTEGER) RETURNS BOOLEAN AS $$
        BEGIN
            RETURN EXISTS (
                SELECT 1
                FROM "StudentRegisterFreeCourse"
                WHERE "studentId" = _student_id AND "courseId" = _course_id
            ) OR EXISTS (
                SELECT
                    1
                FROM
                    "PaidCourseOrder" AS pco
                    INNER JOIN "Order" AS o ON pco."orderId" = o."id"
                WHERE
                    pco."paidCourseId" = _course_id
                    AND o."studentId" = _student_id
            );
        END;
        $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
        CREATE OR REPLACE FUNCTION is_duplicate_pk(_student_id INTEGER, _course_id INTEGER) RETURNS BOOLEAN AS $$
        BEGIN 
            RETURN EXISTS (
                SELECT 1
                FROM "StudentReviewCourse"
                WHERE "studentId" = _student_id AND "courseId" = _course_id
            );
        END;
        $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
        CREATE OR REPLACE FUNCTION is_valid_rating(_rating INTEGER) RETURNS BOOLEAN AS $$
        BEGIN
            RETURN _rating > 0 AND _rating <= 5;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
        CREATE OR REPLACE PROCEDURE insert_review(
            p_student_id INTEGER,
            p_course_id INTEGER,
            p_rating INTEGER,
            p_content TEXT
        ) AS $$
        DECLARE
            validation_error TEXT;
            exist_error TEXT;
        
        BEGIN
            validation_error := validate_review_parameters(p_student_id, p_course_id, p_rating, p_content);
            IF validation_error IS NOT NULL THEN
                RAISE EXCEPTION '%', validation_error;
            END IF;

            exist_error := is_exist_student_or_course(p_student_id, p_course_id);
            IF exist_error IS NOT NULL THEN
                RAISE EXCEPTION '%', exist_error;
            END IF;

            IF NOT is_course_registered(p_student_id, p_course_id) THEN 
                RAISE EXCEPTION 'Học sinh chưa đăng ký khóa học này !';
            END IF;

            IF is_duplicate_pk(p_student_id, p_course_id) THEN
                RAISE EXCEPTION 'Học sinh đã review khóa học này !';
            END IF;

            IF NOT is_valid_rating(p_rating) THEN
                RAISE EXCEPTION 'Điểm rating không hợp lệ !';
            END IF;
        
            INSERT INTO
                "StudentReviewCourse"("studentId", "courseId", "rating", "content")
            VALUES
                (p_student_id, p_course_id, p_rating, p_content);
        END;   
        $$ LANGUAGE plpgsql;
    `);
}

insertReview();
