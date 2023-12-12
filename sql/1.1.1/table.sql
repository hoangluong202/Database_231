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
    "updatedAt" TIMESTAMP(3) NOT NULL,
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

-- drop all tables
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Student" CASCADE;
DROP TABLE IF EXISTS "Instructor" CASCADE;
DROP TABLE IF EXISTS "Course" CASCADE;
DROP TABLE IF EXISTS "Certificate" CASCADE;
DROP TABLE IF EXISTS "FreeCourse" CASCADE;
DROP TABLE IF EXISTS "PaidCourse" CASCADE;
DROP TABLE IF EXISTS "Section" CASCADE;
DROP TABLE IF EXISTS "Lecture" CASCADE;
DROP TABLE IF EXISTS "Material" CASCADE;
DROP TABLE IF EXISTS "Quiz" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "StudentReviewCourse" CASCADE;
DROP TABLE IF EXISTS "StudentRegisterFreeCourse" CASCADE;
DROP TABLE IF EXISTS "PaidCourseOrder" CASCADE;
DROP TABLE IF EXISTS "Answer" CASCADE;