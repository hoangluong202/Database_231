#show raw.where(block: false): box.with(
  fill: luma(240),
  inset: (x: 3pt, y: 0pt),
  outset: (y: 3pt),
  radius: 2pt,
)

#show raw.where(block: true): block.with(
  fill: luma(240),
  inset: 10pt,
  radius: 4pt,
)

= Đề tài và mô tả yêu cầu BTL2
Nhóm xây dựng một số trang đơn giản, quản lí *hệ thống e-learning* đã được thiết kế CSDL ở #link("https://drive.google.com/file/d/1ZtvDi7TC_tHNKAhir1pyb6ByCieXuAtF/view")[BTL1]. Các màn hình nhóm hiện thực bằng UI gồm: 
#block(inset: (left: 1cm))[
  1. Màn hình quản lí các khóa học đã đăng kí của một học sinh.
  2. Màn hình quản lí các review khóa học đã được đăng kí của một học sinh.
  3. Màn hình quản lí các khóa học của một giảng viên (instructor)
]
Các công việc cần làm: 
- Tạo bảng và dữ liệu mẫu. 
- Viết các thủ tục, trigger, hàm. 
- Hiện thực ứng dụng.
= Tạo bảng và dữ liệu mẫu
    #block(inset: (left: 1cm))[
    *Yêu cầu:*
    - Viết các câu lệnh hiện thực các bảng dữ liệu đã thiết kế, trong đó có các ràng buộc khóa chính, khóa ngoại, các ràng buộc dữ liệu và các ràng buộc ngữ nghĩa nêu trong bài tập lớn 1 (sử dụng check hoặc trigger).
    - Tạo dữ liệu mẫu có ý nghĩa ở tất cả các bảng (có thể nhập liệu bằng giao diện hoặc viết câu lệnh)
    *Kết quả:*
    - Tạo kiểu dữ liệu type trong PostgresSQL
    ```SQL
    -- CreateEnum
    CREATE TYPE "CourseLabel" AS ENUM ('Bestseller', 'HotAndNew', 'New', 'HighestRated');

    -- CreateEnum
    CREATE TYPE "AudienceLabel" AS ENUM ('Beginner', 'Intermediate', 'Expert', 'AllLevels');

    -- CreateEnum
    CREATE TYPE "MaterialType" AS ENUM ('Video', 'Text');

    -- CreateEnum
    CREATE TYPE "AnswerOption" AS ENUM ('A', 'B', 'C', 'D');

    -- CreateEnum
    CREATE TYPE "PaymentMethod" AS ENUM ('BankTransfer', 'Cash');
    ```
    - Tạo bảng với các trương dữ liệu, kiểu dữ liệu
    ```sql
    -- CreateTable
    CREATE TABLE "User" (
        "id" SERIAL NOT NULL,
        "email" VARCHAR(50) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(50) NOT NULL,
        "lastName" VARCHAR(50) NOT NULL,
        "avatarUrl" VARCHAR(255) NOT NULL,

        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "Student" (
        "userId" INTEGER NOT NULL,
        "target" VARCHAR(255) NOT NULL,

        CONSTRAINT "Student_pkey" PRIMARY KEY ("userId")
    );

    -- CreateTable
    CREATE TABLE "Instructor" (
        "userId" INTEGER NOT NULL,
        "bankAccountNumber" VARCHAR(20) NOT NULL,
        "position" VARCHAR(100) NOT NULL,

        CONSTRAINT "Instructor_pkey" PRIMARY KEY ("userId")
    );

    -- CreateTable
    CREATE TABLE "Course" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "description" VARCHAR(255),
        "courseLabel" "CourseLabel" NOT NULL,
        "audienceLabel" "AudienceLabel" NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "totalDuration" INTEGER NOT NULL DEFAULT 0,
        "totalSections" INTEGER NOT NULL DEFAULT 0,
        "instructorId" INTEGER NOT NULL,

        CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "Certificate" (
        "id" SERIAL NOT NULL,
        "content" TEXT NOT NULL,
        "expirationDate" TIMESTAMP(3) NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "FreeCourse" (
        "courseId" INTEGER NOT NULL,
        "sponsorName" VARCHAR(100) NOT NULL,

        CONSTRAINT "FreeCourse_pkey" PRIMARY KEY ("courseId")
    );

    -- CreateTable
    CREATE TABLE "PaidCourse" (
        "courseId" INTEGER NOT NULL,
        "priceOriginal" INTEGER NOT NULL,
        "priceDiscounted" INTEGER NOT NULL,
        "discountPercentage" INTEGER NOT NULL,
        "promoEndDate" TIMESTAMP(3),
        "parentId" INTEGER,

        CONSTRAINT "PaidCourse_pkey" PRIMARY KEY ("courseId")
    );

    -- CreateTable
    CREATE TABLE "Section" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "totalCompletionTime" INTEGER NOT NULL,
        "totalLectures" INTEGER NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "Lecture" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "description" VARCHAR(255),
        "duration" INTEGER NOT NULL,
        "sectionId" INTEGER NOT NULL,

        CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "Material" (
        "lectureId" INTEGER NOT NULL,
        "type" "MaterialType" NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "url" VARCHAR(255) NOT NULL,

        CONSTRAINT "Material_pkey" PRIMARY KEY ("lectureId")
    );

    -- CreateTable
    CREATE TABLE "Quiz" (
        "lectureId" INTEGER NOT NULL,
        "totalQuestions" INTEGER NOT NULL,

        CONSTRAINT "Quiz_pkey" PRIMARY KEY ("lectureId")
    );

    -- CreateTable
    CREATE TABLE "Question" (
        "id" SERIAL NOT NULL,
        "content" TEXT NOT NULL,
        "correctOption" "AnswerOption" NOT NULL,
        "quizId" INTEGER NOT NULL,

        CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "Order" (
        "id" SERIAL NOT NULL,
        "totalCost" INTEGER NOT NULL,
        "paymentMethod" "PaymentMethod" NOT NULL,
        "studentId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "Category" (
        "name" VARCHAR(100) NOT NULL,
        "content" TEXT NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "Category_pkey" PRIMARY KEY ("name","courseId")
    );

    -- CreateTable
    CREATE TABLE "StudentReviewCourse" (
        "studentId" INTEGER NOT NULL,
        "courseId" INTEGER NOT NULL,
        "rating" INTEGER NOT NULL CHECK (rating >= 1 and rating <= 5),
        "content" TEXT NOT NULL,
        "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "StudentReviewCourse_pkey" PRIMARY KEY ("studentId","courseId")    
    );

    -- CreateTable
    CREATE TABLE "StudentRegisterFreeCourse" (
        "studentId" INTEGER NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "StudentRegisterFreeCourse_pkey" PRIMARY KEY ("studentId","courseId")
    );

    -- CreateTable
    CREATE TABLE "PaidCourseOrder" (
        "paidCourseId" INTEGER NOT NULL,
        "orderId" INTEGER NOT NULL,

        CONSTRAINT "PaidCourseOrder_pkey" PRIMARY KEY ("paidCourseId","orderId")
    );

    -- CreateTable
    CREATE TABLE "Answer" (
        "questionId" INTEGER NOT NULL,
        "answerOption" "AnswerOption" NOT NULL,
        "content" TEXT NOT NULL,
        "isCorrect" BOOLEAN NOT NULL,
        "explanation" TEXT NOT NULL,

        CONSTRAINT "Answer_pkey" PRIMARY KEY ("questionId","answerOption")
    );
    ```
    - Tạo các mối quan hệ khóa chính, khóa ngoại giữa các bảng
    ```sql 
    -- AddForeignKey
    ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "FreeCourse" ADD CONSTRAINT "FreeCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "PaidCourse" ADD CONSTRAINT "PaidCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "PaidCourse" ADD CONSTRAINT "PaidCourse_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PaidCourse"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Material" ADD CONSTRAINT "Material_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("lectureId") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Order" ADD CONSTRAINT "Order_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Category" ADD CONSTRAINT "Category_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "StudentReviewCourse" ADD CONSTRAINT "StudentReviewCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "StudentReviewCourse" ADD CONSTRAINT "StudentReviewCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "StudentRegisterFreeCourse" ADD CONSTRAINT "StudentRegisterFreeCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "StudentRegisterFreeCourse" ADD CONSTRAINT "StudentRegisterFreeCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "PaidCourseOrder" ADD CONSTRAINT "PaidCourseOrder_paidCourseId_fkey" FOREIGN KEY ("paidCourseId") REFERENCES "PaidCourse"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "PaidCourseOrder" ADD CONSTRAINT "PaidCourseOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ```
    - Tạo các trigger cho các thuộc tính dẫn xuất(2 trigger demo cho phần 1.2.2 sẽ không show ở phần này)
    ```sql
    -- Trigger update correct answer
    CREATE OR REPLACE FUNCTION update_correct_answer() RETURNS TRIGGER AS $$
        BEGIN
        UPDATE "Question"
        SET "correctOption" = COALESCE((SELECT "answerOption" FROM "Answer" WHERE "questionId" = NEW."questionId" AND "isCorrect" = TRUE LIMIT 1),'A')
        WHERE id = NEW."questionId";
        RETURN NULL;
        END;
        $$ LANGUAGE PLPGSQL;

    CREATE OR REPLACE TRIGGER correct_answer_update AFTER
    INSERT
    OR
    UPDATE OF "isCorrect" ON "Answer"
    FOR EACH ROW EXECUTE FUNCTION update_correct_answer();

    -- Trigger update duration of course
    CREATE OR REPLACE FUNCTION update_total_course_duration() RETURNS TRIGGER AS $$
        DECLARE
        course_id INT;
        BEGIN
        IF TG_OP = 'DELETE' THEN
            course_id := OLD."courseId";
        ELSE
            course_id := NEW."courseId";
        END IF;

        UPDATE "Course"
        SET "totalDuration" = (
            SELECT SUM("totalCompletionTime")
            FROM "Section"
            WHERE "courseId" = course_id
        )
        WHERE id = course_id;
        RETURN NULL;
        END;
        $$ LANGUAGE PLPGSQL;

    CREATE OR REPLACE TRIGGER total_duration_course_update AFTER
    INSERT
    OR
    UPDATE OF "totalCompletionTime"
    OR
    DELETE ON "Section"
    FOR EACH ROW EXECUTE FUNCTION update_total_course_duration();

    -- Trigger update duration of section
    CREATE OR REPLACE FUNCTION update_total_duration_section() RETURNS TRIGGER AS $$
        DECLARE
        section_id INT;
        BEGIN
        IF TG_OP = 'DELETE' THEN
            section_id := OLD."sectionId";
        ELSE
            section_id := NEW."sectionId";
        END IF;

        UPDATE "Section"
        SET "totalCompletionTime" = (
            SELECT SUM("duration")
            FROM "Lecture"
            WHERE "sectionId" = section_id
        )
        WHERE id = section_id;
        RETURN NULL;
        END;
        $$ LANGUAGE PLPGSQL;

    CREATE OR REPLACE TRIGGER total_duration_section_update AFTER
    INSERT
    OR
    UPDATE OF duration
    OR
    DELETE ON "Lecture"
    FOR EACH ROW EXECUTE FUNCTION update_total_duration_section();

    --Trigger update total section of course
    CREATE OR REPLACE FUNCTION update_total_section() RETURNS TRIGGER AS $$
        DECLARE
        course_id INT;
        BEGIN
        IF TG_OP = 'DELETE' THEN
            course_id := OLD."courseId";
        ELSE
            course_id := NEW."courseId";
        END IF;
        UPDATE "Course"
        SET "totalSections" = (
            SELECT COUNT(*)
            FROM "Section"
            WHERE "courseId" = course_id
        )
        WHERE id = course_id;
        RETURN NULL;
        END;
        $$ LANGUAGE PLPGSQL;

    CREATE OR REPLACE TRIGGER total_section_update AFTER
    INSERT
    OR
    DELETE ON "Section"
    FOR EACH ROW EXECUTE FUNCTION update_total_section();

    --Trigger update total lucture of section
    CREATE OR REPLACE FUNCTION update_total_lecture() RETURNS TRIGGER AS $$
        DECLARE
        section_id INT;
        BEGIN
        IF TG_OP = 'DELETE' THEN
        section_id := OLD."sectionId";
        ELSE
        section_id := NEW."sectionId";
        END IF;
        UPDATE "Section"
        SET "totalLectures" = (SELECT COUNT(*) FROM "Lecture" WHERE "sectionId" = section_id)
        WHERE id = section_id;
        RETURN NULL;
        END;
        $$ LANGUAGE PLPGSQL;

    CREATE OR REPLACE TRIGGER total_lecture_update AFTER
    INSERT
    OR
    DELETE ON "Lecture"
    FOR EACH ROW EXECUTE FUNCTION update_total_lecture();

    -- Trigger update total question of quiz
    CREATE OR REPLACE FUNCTION update_total_question() RETURNS TRIGGER AS $$
        DECLARE
        quiz_id INT;
        BEGIN

        IF TG_OP = 'DELETE' THEN
            quiz_id := OLD."quizId";
        ELSE
            quiz_id := NEW."quizId";
        END IF;

        UPDATE "Quiz"
        SET "totalQuestions" = (SELECT COUNT(*) FROM "Question" WHERE "quizId" = quiz_id)
        WHERE "lectureId" = quiz_id;
        RETURN NULL;
        END;
        $$ LANGUAGE PLPGSQL;

    CREATE OR REPLACE TRIGGER total_question_update AFTER
    INSERT
    OR
    DELETE ON "Question"
    FOR EACH ROW EXECUTE FUNCTION update_total_question();
    ```
    - Ảnh dữ liệu trong các bảng
    Bảng dữ liệu User
    #image("img/create/user.png")
    Bảng dữ liệu Student
    #image("img/create/student.png", height: 10%)
    Bảng dữ liệu Instructor
    #image("img/create/instructor.png", height: 10%)
    Bảng dữ liệu Course
    #image("img/create/course.png")
    Bảng dữ liệu Certificate
    #image("img/create/certi.png")
    Bảng dữ liệu FreeCourse
    #image("img/create/freecourse.png", height: 10%)
    Bảng dữ liệu PaidCourse
    #image("img/create/paidcourse.png", height: 10%)
    Bảng dữ liệu Section
    #image("img/create/section.png"), height: 10%
    Bảng dữ liệu Lecture
    #image("img/create/lecture.png", height: 10%)
    Bảng dữ liệu Material
    #image("img/create/material.png", height: 10%)
    Bảng dữ liệu Quiz
    #image("img/create/quiz.png", height: 7%)
    Bảng dữ liệu Order
    #image("img/create/order.png")
    Bảng dữ liệu Category
    #image("img/create/category.png")
    Bảng dữ liệu StudentReviewCourse
    #image("img/create/studentreview.png")
    Bảng dữ liệu StudentRegisterFreeCourse
    #image("img/create/student_register.png", height: 10%)
    Bảng dữ liệu PaidCourseOrder
    #image("img/create/paidcorse_order.png", height: 13%)
    Bảng dữ liệu Answer
    #image("img/create/answer.png")
    ]
= Thủ tục - trigger - hàm
    #block(inset: (left: 1cm))[
        == Viết thủ tục INSERT/UPDATE/DELETE
        *Yêu cầu:*

        Viết các thủ tục để thêm (insert), sửa (update), xóa (delete) dữ liệu vào MỘT bảng dữ liệu.
        - Phải có thực hiện việc kiểm tra dữ liệu hợp lệ (validate) để đảm bảo các ràng buộc của bảng dữ liệu.
        - Xuất ra thông báo lỗi có nghĩa, chỉ ra được lỗi sai cụ thể (không ghi chung chung là “Lỗi nhập dữ liệu!”).
        *Kết quả:*
        
        - Học sinh thêm 1 review vào khóa học mà học sinh đó đã tham gia (hoặc đăng kí) - *INSERT*
        ```sql
        -- Insert 
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

CREATE OR REPLACE FUNCTION is_duplicate_pk(_student_id INTEGER, _course_id INTEGER) RETURNS BOOLEAN AS $$
        BEGIN 
            RETURN EXISTS (
                SELECT 1
                FROM "StudentReviewCourse"
                WHERE "studentId" = _student_id AND "courseId" = _course_id
            );
        END;
        $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_valid_rating(_rating INTEGER) RETURNS BOOLEAN AS $$
        BEGIN
            RETURN _rating > 0 AND _rating <= 5;
        END;
        $$ LANGUAGE plpgsql;

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
        $$ LANGUAGE plpgsql;```
        Mô tả:

        1. Hàm _*validate_review_parameters*_: Hàm này được sử dụng để kiểm tra tính hợp lệ của các tham số đầu vào cho việc thêm đánh giá của học sinh. Nếu bất kỳ tham số nào là NULL, hàm sẽ trả về một thông báo lỗi tương ứng. Nếu không có lỗi, nó sẽ trả về NULL.

        2. Hàm *_is_exist_student_or_course_*: Hàm này kiểm tra xem một học sinh và một khóa học có tồn tại trong cơ sở dữ liệu không. Nếu cả hai không tồn tại, nó trả về thông báo lỗi "Không tồn tại học sinh và khóa học này". Nếu chỉ một trong hai không tồn tại, nó trả về thông báo lỗi tương ứng. Nếu cả hai tồn tại hoặc không có lỗi, nó trả về NULL.

        3. Hàm _*is_course_registered*_: Hàm này kiểm tra xem một học sinh đã đăng ký khóa học hay chưa. Nếu học sinh đã đăng ký (được xác định bằng việc tìm thấy dòng tương ứng trong các bảng "StudentRegisterFreeCourse" hoặc "PaidCourseOrder"), nó trả về TRUE; ngược lại, nó trả về FALSE.

        4. Hàm *_is_duplicate_pk_*: Hàm này kiểm tra xem một học sinh đã đánh giá khóa học này trước đó chưa, bằng cách kiểm tra sự tồn tại của một dòng trong bảng "StudentReviewCourse" có khóa chính tương ứng. Nếu đã tồn tại, nó trả về TRUE; ngược lại, nó trả về FALSE.

        5. Hàm *_is_valid_rating_*: Hàm này kiểm tra xem điểm đánh giá có hợp lệ hay không. Trong trường hợp này, điểm hợp lệ được xác định là điểm từ 1 đến 5. Nếu điểm hợp lệ, hàm trả về TRUE; ngược lại, nó trả về FALSE.

        6. Procedure *_insert_review_*: Procedure này thực hiện việc thêm một bản đánh giá mới vào bảng "StudentReviewCourse". Trước khi thêm, nó kiểm tra tính hợp lệ của các tham số đầu vào sử dụng các hàm đã được định nghĩa ở trên. Nếu có lỗi xảy ra (ví dụ: tham số NULL, học sinh chưa đăng ký khóa học, đã đánh giá trước đó, hoặc điểm đánh giá không hợp lệ), procedure sẽ ném ra một ngoại lệ với thông báo lỗi tương ứng. Nếu không có lỗi, nó thêm dòng đánh giá mới vào bảng "StudentReviewCourse".

        - Thực update 1 review - *UPDATE*
        ```sql
        CREATE OR REPLACE PROCEDURE update_review(
            p_student_id INTEGER,
            p_course_id INTEGER,
            p_rating INTEGER,
            p_content TEXT
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

            IF p_rating IS NOT NULL AND (p_rating <= 0 OR p_rating > 5) THEN
                RAISE EXCEPTION 'Điểm rating không hợp lệ !';
            END IF;

            UPDATE 
                "StudentReviewCourse"
            SET
                "rating" = COALESCE(p_rating, "rating"),
                "content" = COALESCE(p_content, "content")
            WHERE
                "studentId" = p_student_id
                AND "courseId" = p_course_id;
        END;
        $$ LANGUAGE plpgsql;
        ```
        Mô tả: 

        1. Procedure *_update_review_* nhận vào bốn tham số: *_p_student_id_* (ID của học sinh), *_p_course_id_* (ID của khóa học), _*p_rating*_ (điểm đánh giá mới), và _*p_content*_ (nội dung đánh giá mới).

        2. Đầu tiên, procedure kiểm tra xem học sinh (có ID là _*p_student_id*_) và khóa học (có ID là _*p_course_id*_) có tồn tại trong cơ sở dữ liệu không. Nếu không tìm thấy học sinh hoặc khóa học tương ứng, procedure sẽ ném ra một ngoại lệ với thông báo lỗi tương ứng.

        3. Tiếp theo, procedure kiểm tra xem có tồn tại một đánh giá của học sinh (_*p_student_id*_) cho khóa học (_*p_course_id*_) trong bảng "StudentReviewCourse" không. Nếu không tìm thấy, procedure cũng ném ra một ngoại lệ với thông báo lỗi "Không tìm thấy review của học sinh này trong khóa học !".

        4. Procedure kiểm tra tính hợp lệ của *_p_rating_* (điểm đánh giá mới). Nếu *_p_rating_* không null và không nằm trong khoảng từ 1 đến 5, procedure sẽ ném ra một ngoại lệ với thông báo lỗi "Điểm rating không hợp lệ !".

        5. Cuối cùng, nếu không có lỗi nào xảy ra trong quá trình kiểm tra, procedure sẽ thực hiện cập nhật bản đánh giá trong bảng "StudentReviewCourse". Nếu *_p_rating_* hoặc _*p_content*_ là null, sẽ sử dụng giá trị hiện tại của cột tương ứng. Cập nhật sẽ được thực hiện dựa trên điều kiện "studentId" và "courseId" của bản đánh giá để đảm bảo rằng chỉ bản đánh giá của học sinh cụ thể cho khóa học cụ thể được cập nhật.

        - Thực hiện xóa 1 review - *DELETE*
        ```sql
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
        ```
        Mô tả: 
        1. Procedure *_delete_review_* nhận vào hai tham số: _*p_student_id*_ (ID của học sinh) và *_p_course_id_* (ID của khóa học) mà bạn muốn xóa đánh giá của học sinh đó.

        2. Đầu tiên, procedure kiểm tra xem học sinh (có ID là _*p_student_id*_) và khóa học (có ID là *_p_course_id_*) có tồn tại trong cơ sở dữ liệu không. Nếu không tìm thấy học sinh hoặc khóa học tương ứng, procedure sẽ ném ra một ngoại lệ với thông báo lỗi tương ứng.

        3. Sau đó, procedure kiểm tra xem có tồn tại một đánh giá của học sinh (_*p_student_id*_) cho khóa học (*_p_course_id_*) trong bảng "StudentReviewCourse" không. Nếu không tìm thấy, procedure cũng ném ra một ngoại lệ với thông báo lỗi "Không tìm thấy review của học sinh này trong khóa học !".

        4. Nếu không có lỗi nào xảy ra trong quá trình kiểm tra, procedure sẽ thực hiện lệnh DELETE để xóa bản đánh giá cụ thể trong bảng "StudentReviewCourse". Xóa sẽ được thực hiện dựa trên điều kiện "studentId" và "courseId" của bản đánh giá để đảm bảo rằng chỉ bản đánh giá của học sinh cụ thể cho khóa học cụ thể được xóa.

        - Lấy review từ học sinh - *GET*
        ```sql
        CREATE OR REPLACE FUNCTION get_review_by_student(p_student_id INTEGER) RETURNS TABLE(
                "courseId" INTEGER,
                "studentId" INTEGER,
                "courseName" VARCHAR(100),
                "categoryName" VARCHAR(100)[],
                rating INTEGER,
                content TEXT,
                "createdAt" TIMESTAMP(3)
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT
                    src."courseId",
                    src."studentId",
                    cr."name" AS "courseName",
                    array_agg(cat."name") AS "categoryName",
                    src."rating",
                    src."content",
                    src."createAt"
                FROM
                    "StudentReviewCourse" AS src
                    INNER JOIN "Course" AS cr ON src."courseId" = cr."id"
                    LEFT JOIN "Category" AS cat ON src."courseId" = cat."courseId"
                WHERE
                    src."studentId" = p_student_id
                GROUP BY
                    cr."name",
                    src."rating",
                    src."content",
                    src."createAt",
                    src."courseId",
                    src."studentId";
            END;
        $$ LANGUAGE plpgsql;
        ```
        Mô tả: 

        1. Hàm get_review_by_student nhận một tham số là p_student_id, là ID của học sinh mà bạn muốn truy vấn đánh giá của.

        2. Hàm trả về một bảng kết quả với các cột sau:

        "courseId": ID của khóa học mà đánh giá liên quan đến.
        "studentId": ID của học sinh.
        "courseName": Tên của khóa học được đánh giá.
        "categoryName": Mảng chứa tên các danh mục liên quan đến khóa học.
        "rating": Điểm đánh giá.
        "content": Nội dung đánh giá.
        "createdAt": Thời gian tạo đánh giá.

        3. Hàm sử dụng lệnh SQL để truy vấn dữ liệu từ các bảng "StudentReviewCourse," "Course," và "Category." Hàm thực hiện các thao tác sau:
        #block(inset: (left: 1cm))[
            - Kết nối bảng "StudentReviewCourse" với bảng "Course" dựa trên trường "courseId."
            - Thực hiện LEFT JOIN với bảng "Category" dựa trên trường "courseId" để lấy danh sách các danh mục liên quan đến khóa học.
            - Lọc kết quả để chỉ lấy các đánh giá mà có "studentId" trùng với tham số đầu vào p_student_id.
            - Sử dụng GROUP BY để tổng hợp kết quả theo "courseName," "rating," "content," "createdAt," "courseId," và "studentId."
        ]
        4. Cuối cùng, hàm trả về kết quả của truy vấn dưới dạng một bảng chứa thông tin về các đánh giá của học sinh cho các khóa học tương ứng.
        == Viết trigger
        == Viết hàm
    ]



= Hiện thực ứng dụng
= Phụ lục
=== ERD
=== Bảng phân công nhiệm vụ
#pagebreak()