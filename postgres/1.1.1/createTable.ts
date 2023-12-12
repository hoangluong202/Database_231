import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function createTable() {
    //create type
    await pool.query(`CREATE TYPE "CourseLabel" AS ENUM ('Bestseller', 'HotAndNew', 'New', 'HighestRated')`);
    await pool.query(`CREATE TYPE "AudienceLabel" AS ENUM ('Beginner', 'Intermediate', 'Expert', 'AllLevels')`);
    await pool.query(`CREATE TYPE "MaterialType" AS ENUM ('Video', 'Text')`);
    await pool.query(`CREATE TYPE "AnswerOption" AS ENUM ('A', 'B', 'C', 'D')`);
    await pool.query(`CREATE TYPE "PaymentMethod" AS ENUM ('BankTransfer', 'Cash')`);

    await pool.query(`CREATE TABLE "User" (
        "id" SERIAL NOT NULL,
        "email" VARCHAR(50) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(50) NOT NULL,
        "lastName" VARCHAR(50) NOT NULL,
        "avatarUrl" VARCHAR(255) NOT NULL,

        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    )`);
    await pool.query(`CREATE TABLE "Student" (
        "userId" INTEGER NOT NULL,
        "target" VARCHAR(255) NOT NULL,

        CONSTRAINT "Student_pkey" PRIMARY KEY ("userId")
    )`);
    await pool.query(`CREATE TABLE "Instructor" (
        "userId" INTEGER NOT NULL,
        "bankAccountNumber" VARCHAR(20) NOT NULL,
        "position" VARCHAR(100) NOT NULL,

        CONSTRAINT "Instructor_pkey" PRIMARY KEY ("userId")
    )`);
    await pool.query(`CREATE TABLE "Course" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "description" VARCHAR(255),
        "courseLabel" "CourseLabel" NOT NULL,
        "audienceLabel" "AudienceLabel" NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "totalDuration" INTEGER NOT NULL DEFAULT 0,
        "totalSections" INTEGER NOT NULL DEFAULT 0,
        "instructorId" INTEGER NOT NULL,

        CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
    )`);
    await pool.query(`CREATE TABLE "Certificate" (
        "id" SERIAL NOT NULL,
        "content" TEXT NOT NULL,
        "expirationDate" TIMESTAMP(3) NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
    )`);
    await pool.query(`CREATE TABLE "FreeCourse" (
        "courseId" INTEGER NOT NULL,
        "sponsorName" VARCHAR(100) NOT NULL,

        CONSTRAINT "FreeCourse_pkey" PRIMARY KEY ("courseId")
    )`);
    await pool.query(`CREATE TABLE "PaidCourse" (
        "courseId" INTEGER NOT NULL,
        "priceOriginal" INTEGER NOT NULL,
        "priceDiscounted" INTEGER NOT NULL,
        "discountPercentage" INTEGER NOT NULL,
        "promoEndDate" TIMESTAMP(3),
        "parentId" INTEGER,

        CONSTRAINT "PaidCourse_pkey" PRIMARY KEY ("courseId")
    )`);
    await pool.query(`CREATE TABLE "Section" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "totalCompletionTime" INTEGER NOT NULL,
        "totalLectures" INTEGER NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
    )`);
    await pool.query(`CREATE TABLE "Lecture" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "description" VARCHAR(255),
        "duration" INTEGER NOT NULL,
        "sectionId" INTEGER NOT NULL,

        CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
    )`);
    await pool.query(`CREATE TABLE "Material" (
        "lectureId" INTEGER NOT NULL,
        "type" "MaterialType" NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "url" VARCHAR(255) NOT NULL,

        CONSTRAINT "Material_pkey" PRIMARY KEY ("lectureId")
    )`);
    await pool.query(`CREATE TABLE "Quiz" (
        "lectureId" INTEGER NOT NULL,
        "totalQuestions" INTEGER NOT NULL,

        CONSTRAINT "Quiz_pkey" PRIMARY KEY ("lectureId")
    )`);
    await pool.query(`CREATE TABLE "Question" (
        "id" SERIAL NOT NULL,
        "content" TEXT NOT NULL,
        "correctOption" "AnswerOption" NOT NULL,
        "quizId" INTEGER NOT NULL,

        CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
    )`);
    await pool.query(`CREATE TABLE "Order" (
        "id" SERIAL NOT NULL,
        "totalCost" INTEGER NOT NULL,
        "paymentMethod" "PaymentMethod" NOT NULL,
        "studentId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
    )`);
    await pool.query(`CREATE TABLE "Category" (
        "name" VARCHAR(100) NOT NULL,
        "content" TEXT NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "Category_pkey" PRIMARY KEY ("name","courseId")
    )`);
    await pool.query(`CREATE TABLE "StudentReviewCourse" (
        "studentId" INTEGER NOT NULL,
        "courseId" INTEGER NOT NULL,
        "rating" INTEGER NOT NULL CHECK (rating >= 1 and rating <= 5),
        "content" TEXT NOT NULL,
        "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "StudentReviewCourse_pkey" PRIMARY KEY ("studentId","courseId")    
    )`);
    await pool.query(`CREATE TABLE "StudentRegisterFreeCourse" (
        "studentId" INTEGER NOT NULL,
        "courseId" INTEGER NOT NULL,

        CONSTRAINT "StudentRegisterFreeCourse_pkey" PRIMARY KEY ("studentId","courseId")
    )`);
    await pool.query(`CREATE TABLE "PaidCourseOrder" (
        "paidCourseId" INTEGER NOT NULL,
        "orderId" INTEGER NOT NULL,

        CONSTRAINT "PaidCourseOrder_pkey" PRIMARY KEY ("paidCourseId","orderId")
    )`);
    await pool.query(`CREATE TABLE "Answer" (
        "questionId" INTEGER NOT NULL,
        "answerOption" "AnswerOption" NOT NULL,
        "content" TEXT NOT NULL,
        "isCorrect" BOOLEAN NOT NULL,
        "explanation" TEXT NOT NULL,

        CONSTRAINT "Answer_pkey" PRIMARY KEY ("questionId","answerOption")
    )`);
    //create foreign key
    await pool.query(`ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")`);
    await pool.query(`ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")`);
    await pool.query(
        `ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("userId")`
    );
    await pool.query(
        `ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")`
    );
    await pool.query(
        `ALTER TABLE "FreeCourse" ADD CONSTRAINT "FreeCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")`
    );
    await pool.query(
        `ALTER TABLE "PaidCourse" ADD CONSTRAINT "PaidCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")`
    );
    await pool.query(
        `ALTER TABLE "PaidCourse" ADD CONSTRAINT "PaidCourse_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PaidCourse"("courseId")`
    );
    await pool.query(`ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")`);
    await pool.query(`ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id")`);
    await pool.query(
        `ALTER TABLE "Material" ADD CONSTRAINT "Material_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id")`
    );
    await pool.query(`ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id")`);
    await pool.query(`ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("lectureId")`);
    await pool.query(`ALTER TABLE "Order" ADD CONSTRAINT "Order_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId")`);
    await pool.query(`ALTER TABLE "Category" ADD CONSTRAINT "Category_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")`);
    await pool.query(
        `ALTER TABLE "StudentReviewCourse" ADD CONSTRAINT "StudentReviewCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId")`
    );
    await pool.query(
        `ALTER TABLE "StudentReviewCourse" ADD CONSTRAINT "StudentReviewCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")`
    );
    await pool.query(
        `ALTER TABLE "StudentRegisterFreeCourse" ADD CONSTRAINT "StudentRegisterFreeCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId")`
    );
    await pool.query(
        `ALTER TABLE "StudentRegisterFreeCourse" ADD CONSTRAINT "StudentRegisterFreeCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")`
    );
    await pool.query(
        `ALTER TABLE "PaidCourseOrder" ADD CONSTRAINT "PaidCourseOrder_paidCourseId_fkey" FOREIGN KEY ("paidCourseId") REFERENCES "PaidCourse"("courseId")`
    );
    await pool.query(
        `ALTER TABLE "PaidCourseOrder" ADD CONSTRAINT "PaidCourseOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id")`
    );
    await pool.query(`ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id")`);

    //create index
    await pool.query(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
    `);
}
createTable();
