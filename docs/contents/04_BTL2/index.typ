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
        *Kết quả:* Có 4 thủ tục được viết trong báo cáo này.
        #image("img/crud-review/procedures-insert-update-delete-review.png")
        - Thủ tục 1: Học sinh thêm 1 review vào khóa học mà học sinh đó đã tham gia (hoặc đăng kí) - *INSERT*
        - _Code thủ tục 1:_
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
        #block(inset: (left: 1cm))[
            Hình 1.1: Thực hiện thủ tục 1 trong DBMS. Ta chú ý tham số đầu tiên là _p_student_id_ = 1
        ]
        #image("img/crud-review/insert-review-exec.png")
        #block(inset: (left: 1cm))[
            Hình 1.2: Kết sau khi thực hiện thủ tục 1 trong DBMS như trên, _Bảng nhận xét của học sinh có id = 1 đã được cập nhật,_ dòng số 1
        ]
        #image("img/crud-review/insert-review-result.png")
        Mô tả:

        1. Hàm _*validate_review_parameters*_: Hàm này được sử dụng để kiểm tra tính hợp lệ của các tham số đầu vào cho việc thêm đánh giá của học sinh. Nếu bất kỳ tham số nào là NULL, hàm sẽ trả về một thông báo lỗi tương ứng. Nếu không có lỗi, nó sẽ trả về NULL.

        2. Hàm *_is_exist_student_or_course_*: Hàm này kiểm tra xem một học sinh và một khóa học có tồn tại trong cơ sở dữ liệu không. Nếu cả hai không tồn tại, nó trả về thông báo lỗi "Không tồn tại học sinh và khóa học này". Nếu chỉ một trong hai không tồn tại, nó trả về thông báo lỗi tương ứng. Nếu cả hai tồn tại hoặc không có lỗi, nó trả về NULL.

        3. Hàm _*is_course_registered*_: Hàm này kiểm tra xem một học sinh đã đăng ký khóa học hay chưa. Nếu học sinh đã đăng ký (được xác định bằng việc tìm thấy dòng tương ứng trong các bảng "StudentRegisterFreeCourse" hoặc "PaidCourseOrder"), nó trả về TRUE; ngược lại, nó trả về FALSE.

        4. Hàm *_is_duplicate_pk_*: Hàm này kiểm tra xem một học sinh đã đánh giá khóa học này trước đó chưa, bằng cách kiểm tra sự tồn tại của một dòng trong bảng "StudentReviewCourse" có khóa chính tương ứng. Nếu đã tồn tại, nó trả về TRUE; ngược lại, nó trả về FALSE.

        5. Hàm *_is_valid_rating_*: Hàm này kiểm tra xem điểm đánh giá có hợp lệ hay không. Trong trường hợp này, điểm hợp lệ được xác định là điểm từ 1 đến 5. Nếu điểm hợp lệ, hàm trả về TRUE; ngược lại, nó trả về FALSE.

        6. Procedure *_insert_review_*: Procedure này thực hiện việc thêm một bản đánh giá mới vào bảng "StudentReviewCourse". Trước khi thêm, nó kiểm tra tính hợp lệ của các tham số đầu vào sử dụng các hàm đã được định nghĩa ở trên. Nếu có lỗi xảy ra (ví dụ: tham số NULL, học sinh chưa đăng ký khóa học, đã đánh giá trước đó, hoặc điểm đánh giá không hợp lệ), procedure sẽ ném ra một ngoại lệ với thông báo lỗi tương ứng. Nếu không có lỗi, nó thêm dòng đánh giá mới vào bảng "StudentReviewCourse".

        -Thủ tục 2: hiện thực update 1 review - *UPDATE*
        - _Code thủ tục 2: _
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
        #block(inset: (left: 1cm))[
         Hình 2.1: Thực hiện update 1 review của 1 học sinh, _Ta chú ý tham số đầu tiên là p_student_id_ = 1
        ]
        #image("img/crud-review/update-review-exec.png")
        #block(inset: (left: 1cm))[
        Hình 2.2: Kết sau khi thực hiện thủ tục 1 trong DBMS như trên, Bảng nhận xét của học sinh có id = 1 đã được cập nhật, dòng số 1
        ]
        #image("img/crud-review/update-review-result.png")
        Mô tả: 

        1. Procedure *_update_review_* nhận vào bốn tham số: *_p_student_id_* (ID của học sinh), *_p_course_id_* (ID của khóa học), _*p_rating*_ (điểm đánh giá mới), và _*p_content*_ (nội dung đánh giá mới).

        2. Đầu tiên, procedure kiểm tra xem học sinh (có ID là _*p_student_id*_) và khóa học (có ID là _*p_course_id*_) có tồn tại trong cơ sở dữ liệu không. Nếu không tìm thấy học sinh hoặc khóa học tương ứng, procedure sẽ ném ra một ngoại lệ với thông báo lỗi tương ứng.

        3. Tiếp theo, procedure kiểm tra xem có tồn tại một đánh giá của học sinh (_*p_student_id*_) cho khóa học (_*p_course_id*_) trong bảng "StudentReviewCourse" không. Nếu không tìm thấy, procedure cũng ném ra một ngoại lệ với thông báo lỗi "Không tìm thấy review của học sinh này trong khóa học !".

        4. Procedure kiểm tra tính hợp lệ của *_p_rating_* (điểm đánh giá mới). Nếu *_p_rating_* không null và không nằm trong khoảng từ 1 đến 5, procedure sẽ ném ra một ngoại lệ với thông báo lỗi "Điểm rating không hợp lệ !".

        5. Cuối cùng, nếu không có lỗi nào xảy ra trong quá trình kiểm tra, procedure sẽ thực hiện cập nhật bản đánh giá trong bảng "StudentReviewCourse". Nếu *_p_rating_* hoặc _*p_content*_ là null, sẽ sử dụng giá trị hiện tại của cột tương ứng. Cập nhật sẽ được thực hiện dựa trên điều kiện "studentId" và "courseId" của bản đánh giá để đảm bảo rằng chỉ bản đánh giá của học sinh cụ thể cho khóa học cụ thể được cập nhật.

        - Thủ tục 3: Thực hiện xóa 1 review - *DELETE*
        - _Code thủ tục 3:_
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
        #block(inset: (left: 1cm))[
         Hình 3.1: Thực hiện xóa 1 review của 1 học sinh, _Ta chú ý tham số đầu tiên là p_student_id_ = 1 và _tham số thứ 2 p_course_id _= 4
        ]
        #image("img/crud-review/delete-review-exec.png")
        #block(inset: (left: 1cm))[
        Hình 3.2: Kết sau khi thực hiện thủ tục 1 trong DBMS như trên, Bảng nhận xét của học sinh có id = 1 đã được cập nhật, không còn đánh giá cho khóa học có id = 4.
        ]
        #image("img/crud-review/delete-review-result.png")
        Mô tả: 
        1. Procedure *_delete_review_* nhận vào hai tham số: _*p_student_id*_ (ID của học sinh) và *_p_course_id_* (ID của khóa học) mà bạn muốn xóa đánh giá của học sinh đó.

        2. Đầu tiên, procedure kiểm tra xem học sinh (có ID là _*p_student_id*_) và khóa học (có ID là *_p_course_id_*) có tồn tại trong cơ sở dữ liệu không. Nếu không tìm thấy học sinh hoặc khóa học tương ứng, procedure sẽ ném ra một ngoại lệ với thông báo lỗi tương ứng.

        3. Sau đó, procedure kiểm tra xem có tồn tại một đánh giá của học sinh (_*p_student_id*_) cho khóa học (*_p_course_id_*) trong bảng "StudentReviewCourse" không. Nếu không tìm thấy, procedure cũng ném ra một ngoại lệ với thông báo lỗi "Không tìm thấy review của học sinh này trong khóa học !".

        4. Nếu không có lỗi nào xảy ra trong quá trình kiểm tra, procedure sẽ thực hiện lệnh DELETE để xóa bản đánh giá cụ thể trong bảng "StudentReviewCourse". Xóa sẽ được thực hiện dựa trên điều kiện "studentId" và "courseId" của bản đánh giá để đảm bảo rằng chỉ bản đánh giá của học sinh cụ thể cho khóa học cụ thể được xóa.

        - Thủ tục 4: Lấy review từ học sinh - *GET*
        - _Code thủ tục 4: _
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
        #block(inset: (left: 1cm))[
            Hình 4.1: Thực hiện thủ tục 4 trong DBMS, kết quả trả về là một bảng gồm các đánh giá của học sinh.
        ]
        #image("img/crud-review/select-review-by-student.png")
        Mô tả: 

        1. Hàm *_get_review_by_student_* nhận một tham số là _*p_student_id*_, là ID của học sinh mà bạn muốn truy vấn đánh giá của.

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
        #block(inset: (left: 1cm))[
            - *Yêu cầu*
            
            Viết 2 trigger để kiểm soát các hành động INSERT, UPDATE, DELETE trên một số bảng đã tạo thỏa mãn yêu cầu sau:
    
            \- Có ít nhất 1 trigger có tính toán cập nhật dữ liệu trên bảng dữ liệu khác bảng đang được thiết lập trigger. (Trigger liên quan đến việc tính toán thuộc tính dẫn xuất)

            \- Chuẩn bị câu lệnh và dữ liệu minh họa cho việc kiểm tra trigger khi báo cáo.

            - *Kết quả*
            #block(inset: (left: 1cm))[Các trigger mà nhóm đã hiện thực
            #image("img/trigger/trigger-function.png", height: 20%)]

            
            _*Trigger 1: Thuộc tính dẫn xuất trong cùng một bảng*_
            #block(inset: (left: 0.5cm))[
                _Mô tả:_
                - Giá của một khóa học có phí sẽ được tự động cập nhật bằng giá gốc trừ giá khuyến mãi.
                - Trigger này sẽ được kích hoạt khi thêm mới hoặc có sự cập nhật của giá gốc hoặc phần trăm   khuyến mãi hoặc ngày hết hạn khuyến mãi của một khóa học có phí (PaidCourse)
                - Nếu hết thời gian khuyến mãi vượt quá hạn thì tự động cập nhật tỉ lệ giảm giá là 0%
                _Code trigger 1:_
                ```sql
                -- Create trigger function
                CREATE OR REPLACE FUNCTION update_paid_course_price() RETURNS TRIGGER AS $$
                    BEGIN
                    IF NEW."promoEndDate" IS NOT NULL AND NEW."promoEndDate" < NOW() THEN
                        NEW."discountPercentage" := 0;
                    END IF;
                    NEW."priceDiscounted" := NEW."priceOriginal" * (100-NEW."discountPercentage")/100;
                    RETURN NEW;
                    END;
                    $$ LANGUAGE PLPGSQL;

                -- Create trigger
                CREATE OR REPLACE TRIGGER paid_course_price_update
                    BEFORE
                    INSERT
                    OR
                    UPDATE OF "priceOriginal",
                            "discountPercentage",
                            "promoEndDate" ON "PaidCourse"
                    FOR EACH ROW EXECUTE FUNCTION update_paid_course_price();
                ```
                #block(inset: (left: 1cm))[Hình 1.1: Trước khi thực hiện trigger.]
                #image("img/trigger/update-paid-course-price-1-paid-course.png")
                #block(inset: (left: 1cm))[Hình 1.2: Sau khi thực hiện trigger, cập nhật phần trăm khuyến mãi.]
                #image("img/trigger/update-paid-course-price-2-action-and-result.png")
            ]
            *_Trigger 2: Thuộc tính dẫn xuất khác bảng_*
            #block(inset: (left: 0.6cm))[
                _Mô tả:_
                - Tổng số tiền của một đơn hàng sẽ được tự động cập nhật bằng tổng giá bản của các khóa học có phí đã được thêm vào đơn hàng
                - Trigger này sẽ được kích hoạt khi thêm hoặc xóa một khóa học có phí khỏi một đơn hàng
                _Code trigger 2: _
                ```sql
                CREATE OR REPLACE FUNCTION update_total_cost() RETURNS TRIGGER AS $$
                    DECLARE
                    order_id INT;
                    BEGIN
                        IF TG_OP = 'DELETE' THEN
                            order_id := OLD."orderId";
                        ELSE
                            order_id := NEW."orderId";
                        END IF;

                        UPDATE "Order" o
                        SET "totalCost" = (
                            SELECT COALESCE(SUM("priceDiscounted"), 0)
                            FROM "PaidCourse" pc
                            JOIN "PaidCourseOrder" pco ON pc."courseId" = pco."paidCourseId"
                            WHERE pco."orderId" = order_id
                        )
                        WHERE o.id = order_id;
                        RETURN NULL;
                    END;
                    $$ LANGUAGE PLPGSQL;

                CREATE OR REPLACE TRIGGER total_cost_update AFTER
                INSERT
                OR
                DELETE ON "PaidCourseOrder"
                FOR EACH ROW EXECUTE FUNCTION update_total_cost();
                ```
                #block(inset: (left: 1cm))[Hình 2.1: Trước khi thực hiện trigger, hình bên dưới là các khóa học mà học sinh này đăng kí.]
                #image("img/trigger/update-total-cost-1-paid-course.png")
                #block(inset: (left: 1cm))[Hình 2.2:  Trước khi thực hiện trigger, các khóa học ở hình trên đều được lưu vào 1 bảng PaidCourseOrder có orderId = 1.]
                #image("img/trigger/update-total-cost-2-paid-course-order.png")
                #block(inset: (left: 1cm))[Hình 2.3: Trước khi thực hiện trigger, tổng giá tiền của Order này là 630000 cho 6 khóa học.]
                #image("img/trigger/update-total-cost-3-order.png")
                #block(inset: (left: 1cm))[Hình 2.4: Sau khi thực hiện trigger (xóa 2 khóa học khỏi danh sách).]
                #image("img/trigger/update-total-cost-4-action.png")
                #block(inset: (left: 1cm))[Hình 2.5: Sau khi thực hiện trigger, bảng Order được cập nhật lại với tổng số tiền cần trả là 210000 (tiền đã được discount của khóa học có id = 2 và 3).]
                #image("img/trigger/update-total-cost-5-result.png")
                
            ]
            _*Trigger 3->8: trigger cho các thuộc tính dẫn xuất khác*_
            #block(inset: (left: 0.6cm))[
                - Tạo các trigger cho các thuộc tính dẫn xuất(2 trigger demo cho phần 1.2.2 sẽ không show ở phần này)
                _Mô tả:_

                *Trigger 3 và hàm update_correct_answer:*
                #block(inset: (left: 0.6cm))[
                    - Trigger *correct_answer_update* được kích hoạt sau khi có sự thay đổi (INSERT hoặc UPDATE) trên bảng "Answer" và liên quan đến cột "isCorrect".
                    - Hàm *update_correct_answer* được gọi bởi trigger này và được sử dụng để cập nhật cột "correctOption" trong bảng "Question".
                    - Trigger này giúp đảm bảo rằng "correctOption" trong bảng "Question" sẽ luôn thể hiện câu trả lời đúng (được lấy từ bảng "Answer").
                ]
                
                *Trigger 4 và hàm update_total_course_duration:    *
                #block(inset: (left: 0.6cm))[
                    - Trigger *total_duration_course_update* được kích hoạt sau khi có sự thay đổi (INSERT, UPDATE, hoặc DELETE) trên bảng "Section" và liên quan đến cột "totalCompletionTime".
                    - Hàm *update_total_course_duration* được gọi bởi trigger này và được sử dụng để cập nhật cột "totalDuration" trong bảng "Course".
                    - Trigger này cập nhật tổng thời lượng của một khóa học dựa trên tổng thời lượng các phần ("Section") trong khóa học.
                ]
                
                *Trigger 5 và hàm update_total_duration_section:*
                #block(inset: (left: 0.6cm))[
                    - Trigger *total_duration_section_update* được kích hoạt sau khi có sự thay đổi (INSERT, UPDATE, hoặc DELETE) trên bảng "Lecture" và liên quan đến cột "duration".
                    - Hàm *update_total_duration_section* được gọi bởi trigger này và được sử dụng để cập nhật cột "totalCompletionTime" trong bảng "Section".
                    - Trigger này cập nhật tổng thời lượng của một phần ("Section") dựa trên tổng thời lượng các bài giảng ("Lecture") trong phần đó.
                ]
             
                *Trigger 6 và hàm update_total_section:*
                #block(inset: (left: 0.6cm))[
                    - Trigger *total_section_update* được kích hoạt sau khi có sự thay đổi (INSERT hoặc DELETE) trên bảng "Section".
                    - Hàm *update_total_section* được gọi bởi trigger này và được sử dụng để cập nhật cột "totalSections" trong bảng "Course".
                    - Trigger này cập nhật tổng số các phần trong khóa học.
                ]
          
                *Trigger 7 và hàm update_total_lecture:*
                #block(inset: (left: 0.6cm))[
                    - Trigger *total_lecture_update* được kích hoạt sau khi có sự thay đổi (INSERT hoặc DELETE) trên bảng "Lecture".
                    - Hàm *update_total_lecture* được gọi bởi trigger này và được sử dụng để cập nhật cột "totalLectures" trong bảng "Section".
                    - Trigger này cập nhật tổng số bài giảng trong một phần.
                ]
                
                *Trigger 8 và hàm update_total_question:*
                #block(inset: (left: 0.6cm))[
                    Trigger *total_question_update* được kích hoạt sau khi có sự thay đổi (INSERT hoặc DELETE) trên bảng "Question".
                    Hàm *update_total_question* được gọi bởi trigger này và được sử dụng để cập nhật cột "totalQuestions" trong bảng "Quiz".
                    Trigger này cập nhật tổng số câu hỏi trong một bài kiểm tra ("Quiz").
                ]
                _Code:_
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
            ]

        ]



        == Viết hàm
        #block(inset: (left: 0.6cm))[
            - *Yêu cầu:*
            Viết 2 hàm thỏa yêu cầu sau:
            #block(inset: (left: 0.6cm))[
                - Chứa câu lệnh IF và/hoặc LOOP để tính toán dữ liệu được lưu trữ.
                - Chứa câu lệnh truy vấn dữ liệu, lấy dữ liệu từ câu truy vấn để kiểm tra tính toán.
                - Có tham số đầu vào và kiểm tra tham số đầu vào.
                - Chuẩn bị các câu lệnh và dữ liệu để minh họa việc gọi hàm khi báo cáo.
            ]
            
            - *Kết quả:*
            #block(inset: (left: 0.6cm))[Tất cả function mà nhóm đã hiện thực]
            #image("img/function/function-all.png")
            #block(inset: (left: 0.6cm))[
                - *Hàm 1:* Tên khóa học có điểm rating trung bình cao nhất cùng với điểm rating đó theo từng loại đối tượng khóa học.
                #block(inset: (left: 0.6cm))[
                    - Input: là nhãn đối tượng người học (Beginner, Intermediate,  Expert,  AllLevels)
                    - Output: 
                    #block(inset: (left: 0.6cm))[
                        - Tên khóa học mà có điểm rating cao nhất và điểm rating đó.
                        - Exception 1: Thông báo lỗi Nhãn đối tượng người học không được NULL
                        - Exception 2: Thông báo lỗi Nhãn đối tượng người học phải thuộc 1 trong 4 nhãn ở trên
                        - Exception 3: Thông báo lỗi Không có khóa học nào với nhãn đối tượng trên
                        - Exception 4: Thông báo lỗi Không có bất kì review nào ở tất cả các khóa học với nhãn đối tượng trên
                    ]
                    - Code hàm 1: 
                   
                ]
                 ```sql
                    CREATE OR REPLACE FUNCTION get_highest_rating_course(audience_label "AudienceLabel") RETURNS TABLE("name" VARCHAR, "averageRating" NUMERIC(10, 2)) AS $$
                        DECLARE
                            cou RECORD;
                            max_course_name VARCHAR;
                            max_average_rating NUMERIC(10,2) = 0;
                        BEGIN
                            -- check if audience label is NULL and raise exception
                            IF audience_label IS NULL THEN
                                RAISE EXCEPTION 'Audience label is null!';
                            END IF;

                            -- get all courses by audience label, if not found raise exception
                            IF NOT EXISTS (SELECT * FROM "Course" WHERE "audienceLabel" = audience_label) THEN
                                RAISE EXCEPTION 'Course with audience label % not found!', audience_label;
                            END IF;

                            -- in StudentReviewCourse, group by courseId and calculate average rating
                            -- add a new column "averageRating" to result
                            FOR cou IN
                                SELECT "Course".id , "Course".name, AVG("StudentReviewCourse"."rating")::NUMERIC(10,2) AS "averageRating"
                                FROM "Course"
                                JOIN "StudentReviewCourse" ON "Course".id = "StudentReviewCourse"."courseId"
                                WHERE "Course"."audienceLabel" = audience_label
                                GROUP BY "Course".id
                            LOOP
                                IF cou."averageRating" > max_average_rating THEN
                                    max_course_name := cou.name;
                                    max_average_rating := cou."averageRating";
                                END IF;
                            END LOOP;

                            -- return the course with the max rating or raise an exception if not found
                            IF max_average_rating = 0 THEN
                                RAISE EXCEPTION 'Course with audience label % not found review!', audience_label;
                            END IF;
                            RETURN QUERY SELECT max_course_name, max_average_rating;
                        END;
                        $$ LANGUAGE PLPGSQL;
                    ```
                    #block(inset: (left: 0.6cm))[Hình 1: Thực hiện hàm 1 trong DBMS]
                    #image("img/function/get-highest-rating-course-result.png")
                - *Hàm 2:* Tính doanh thu của các khóa học có phí đã bán được trong một năm nhất định.
                #block(inset: (left:  0.6cm))[
                    - Input:là năm để tính doanh thu, phải là số nguyên dương
                    - Output: 
                    #block(inset: (left:  0.6cm))[ 
                        - Doanh thu của từng khóa học trong một năm
                        - Exception1 : Thông báo lỗi Invalid input khi input NULL hoặc không phải là số.
                    ]
                    - Code hàm 2: 
                ]
                ```sql
                CREATE OR REPLACE FUNCTION get_revenue(YEAR INT) RETURNS TABLE(name VARCHAR, revenue INT) AS $$
                    DECLARE
                        pai_cou RECORD;
                        total_revenue INT;
                    BEGIN
                        IF year IS NULL THEN
                        RAISE EXCEPTION 'Year is null!';
                        END IF;

                        IF year < 0 THEN
                        RAISE EXCEPTION 'Year is invalid!';
                        END IF;

                        FOR pai_cou IN
                        SELECT "Course".id, "Course".name, "PaidCourse"."priceDiscounted"
                        FROM "PaidCourse"
                        LEFT JOIN "Course" ON "Course".id = "PaidCourse"."courseId"
                        LOOP
                        SELECT COALESCE(SUM("PaidCourse"."priceDiscounted"),0) INTO total_revenue
                        FROM "PaidCourse"
                        JOIN "PaidCourseOrder" ON "PaidCourseOrder"."paidCourseId" = "PaidCourse"."courseId"
                        JOIN "Order" ON "Order".id = "PaidCourseOrder"."orderId"
                        WHERE "PaidCourse"."courseId" = pai_cou.id AND EXTRACT(YEAR FROM "Order"."createdAt") = year;

                        name := pai_cou.name;
                        revenue := total_revenue;
                        RETURN NEXT;
                        END LOOP;
                    END;
                    $$ LANGUAGE PLPGSQL;
                ```
                #block(inset: (left: 0.6cm))[Hình 2: Thực hiện hàm 2 trong DBMS]
                #image("img/function/get-revenue-result.png")
            ]
        ]
    ]


#pagebreak()
= Hiện thực ứng dụng
#block(inset: (left: 1cm))[
    - *Màn hình 1:* hiển thị các khóa học mà một học sinh đã đăng kí.
    - _Mô tả:_ Học sinh có thể xem các khóa học mà mình đã đăng kí (thông tin bao gồm: tên, phí khóa học, mô tả) ở màn hình này, đồng thời có thể thêm nhận xét cho các khóa học chưa được nhận xét. 

    #image("img/ui/mh1.png")

    - *Màn hình 2:* là các đánh giá của học sinh về các khóa học mà mình đã đăng kí (khóa học miễn phí) hoặc thanh toán (khóa học có phí) thành công.
    - _Mô tả:_ Học sinh có thể xem các review mình đã đánh giá từ trước, đồng thời cũng có thể thay đổi nội dung đánh giá hoặc xóa đánh giá đó. 

    #image("img/ui/mh2.png")
    - *Màn hình 3:* là màn hình dùng cho người dùng có vai trò là giảng viên, hiển thị các khóa học mà giảng viên đó giảng dạy. 

    - _Mô tả:_ Giảng viên có thể sử dụng chức năng Lọc khóa học (sẽ lọc theo các nhãn đối tượng, nhãn khóa học)

    #image("img/ui/mh3.png")
]
= Phụ lục
#pagebreak()
=== ERD: 
#image("img/type_and_table/ERD.png")

#pagebreak()
=== Bảng phân công nhiệm vụ
#table(
  columns: (auto, auto, auto),
  [*MSSV*], [*Tên*], [*Công việc*],
  $2013722$,
  $"Hoàng Lương (nhóm trưởng)"$,
  [
    - Phụ trách backend.
  ],
  $2114417$,
  $"Nguyễn Ngọc Phú"$,
  [
    - Phụ trách frontend.
  ],
  $2213994$,
  $"Lâm Vũ"$,
  [
    - Viết báo cáo
    - Hiện thực các câu lệnh SQL \
  ],
  $2110934$,
  $"Nguyễn Tuấn Duy"$,
  [
    - Hiện thực các câu lệnh SQL \
  ],
  $2114939$,
  $"Trần Minh Thuận"$,
  [
    - Hiện thực các câu lệnh SQL \
  ],
)