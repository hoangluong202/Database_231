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

-- Drop all types
DROP TYPE IF EXISTS "CourseLabel";
DROP TYPE IF EXISTS "AudienceLabel";
DROP TYPE IF EXISTS "MaterialType";
DROP TYPE IF EXISTS "AnswerOption";
DROP TYPE IF EXISTS "PaymentMethod";