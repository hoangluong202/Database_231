-- Insert 5 User (1 Instructor, 3 Student, 1 Instructor&Student)

INSERT INTO "User" ("id",
                    "email",
                    "password",
                    "firstName",
                    "lastName",
                    "avatarUrl")
VALUES (1, 'hluong@gmail.com', '$2b$10$0LtqsgPj1Oi8DKHpsMfyWuj5vhxGYfhm6IyAufS1XXZNzjTbGCdz.', 'Hoàng', 'Lương', 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'),
       (2, 'lvu@gmail.com', '$2b$10$0LtqsgPj1Oi8DKHpsMfyWuj5vhxGYfhm6IyAufS1XXZNzjTbGCdz.', 'Lâm', 'Vũ', 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'),
       (3, 'nnphu@gmail.com', '$2b$10$0LtqsgPj1Oi8DKHpsMfyWuj5vhxGYfhm6IyAufS1XXZNzjTbGCdz.', 'Nguyễn Ngọc', 'Phú', 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'),
       (4, 'ntduy@gmail.com', '$2b$10$0LtqsgPj1Oi8DKHpsMfyWuj5vhxGYfhm6IyAufS1XXZNzjTbGCdz.', 'Nguyễn Tuấn', 'Duy', 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'),
       (5, 'tmthuany@gmail.com', '$2b$10$0LtqsgPj1Oi8DKHpsMfyWuj5vhxGYfhm6IyAufS1XXZNzjTbGCdz.', 'Trần Minh', 'Thuận', 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50');


INSERT INTO "Student" ("userId",
                       "target")
VALUES (1, 'Software Engineer'),
       (3, 'Database Administrator At Google'),
       (4, 'Fullstack Developer'),
       (5, 'Backend Developer');


INSERT INTO "Instructor" ("userId",
                          "bankAccountNumber",
                          "position")
VALUES (2, '9374882123', 'Software Engineer At Google'),
       (3, '9374882124', 'AI Researcher At OpenAI');

-- Insert 3 Course: 1 Free Course, 2 Paid Course(1 Parent Course, 1 Child Course)

INSERT INTO "Course" ("name",
                      "description",
                      "courseLabel",
                      "audienceLabel",
                      "instructorId")
VALUES ('HTML for Beginners', 'Learn HTML to become a fullstack developer', 'HighestRated', 'Beginner', 2),
       ('SQL for Beginners', 'Learn SQL from zero to hero', 'Bestseller', 'Beginner', 3),
       ('PostgreSQL to in depth', 'Learn PostgreSQL to become a DBA', 'Bestseller', 'Intermediate', 3);


INSERT INTO "FreeCourse" ("courseId",
                          "sponsorName")
VALUES (1,'Google');


INSERT INTO "PaidCourse" ("courseId",
                          "priceOriginal",
                          "priceDiscounted",
                          "discountPercentage",
                          "promoEndDate",
                          "parentId")
VALUES (2, 100000, 50000, 50, NULL, NULL),
       (3, 200000, 160000, 20, NULL, 2);

-- Insert 2 Section of SQL for Beginners Course

INSERT INTO "Section" ("name",
                       "totalCompletionTime",
                       "totalLectures",
                       "courseId")
VALUES ('Data Definition Language (DDL)', 0, 0, 2),
       ('Data Manipulation Language (DML)', 0, 0, 2);

-- Insert 3 Lecture of SQL for Beginners Course (2 Lectures for DDL Section, 1 Lecture for DML Section)

INSERT INTO "Lecture" ("name",
                       "description",
                       "duration",
                       "sectionId")
VALUES ('Create Table', 'Learn how to create a table in SQL', 1000, 1),
       ('Alter Table', 'Learn how to alter a table in SQL', 600, 1),
       ('Quiz INSERT', 'Synthetic quiz for INSERT statement', 600, 2);

-- Insert 2 Material of Create Table Lecture, 1 Material of Alter Table Lecture

INSERT INTO "Material" ("lectureId",
                        "type",
                        "name",
                        "url")
VALUES (1, 'Video', 'Video tutorial', 'https://www.youtube.com/watch?v=QnBp4NjUQPU'),
       (2, 'Text', 'PDF tutorial', 'https://www.tutorialspoint.com/sql/sql-alter-command.htm');

-- Insert 1 Quiz of Quiz INSERT Lecture

INSERT INTO "Quiz" ("lectureId",
                    "totalQuestions")
VALUES (3,0);

-- Insert 1 Question of Quiz INSERT Lecture

INSERT INTO "Question" ("content",
                        "correctOption",
                        "quizId")
VALUES ('Which statement is correct?','D',3);

-- Insert 4 Answer of Question 1

INSERT INTO "Answer" ("questionId",
                      "answerOption",
                      "content",
                      "isCorrect",
                      "explanation")
VALUES (1, 'A', 'INSERT INTO table_name VALUES (value1, value2, value3, ...);', TRUE, 'This is the correct syntax for INSERT statement'),
       (1, 'B', 'INSERT INTO table_name (column1, column2, column3, ...)', FALSE, 'This is the incorrect syntax for INSERT statement'),
       (1, 'C', 'INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...)', FALSE, 'This is the incorrect syntax for INSERT statement'),
       (1, 'D', 'All of the above', FALSE, 'This is the incorrect syntax for INSERT statement');

-- Student 1 order 2 Paid Course

INSERT INTO "Order" ("totalCost",
                     "paymentMethod",
                     "studentId",
                     "createdAt")
VALUES (0,'Cash',1,'2023-12-12 08:19:15.060 UTC');


-- Student 1 register 1 Free Course

INSERT INTO "StudentRegisterFreeCourse" ("studentId",
                                         "courseId")
VALUES (1,1);

-- Student 1 review 3 Course

INSERT INTO "StudentReviewCourse" ("createAt",
                                   "studentId",
                                   "content",
                                   "rating",
                                   "courseId")
VALUES ('2023-12-12 08:19:15.072 UTC',1,'It is so easy',3,1),
       ('2023-12-12 08:19:15.072 UTC',1,'This course is awesome',5,2),
       ('2023-12-12 08:19:15.072 UTC',1,'This course is not bad',4,3);

-- 2 Paid Course has 2 Certificate

INSERT INTO "Certificate" ("content",
                           "courseId",
                           "expirationDate")
VALUES ('Congratulation! You have completed SQL for Beginners course',2,'2025-12-31 00:00:00 UTC'),
       ('Congratulation! You have completed PostgreSQL to in depth course',3,'2025-12-31 00:00:00 UTC');

-- Insert 2 Category of SQL for Beginners Course

INSERT INTO "Category" ("courseId",
                        "description",
                        "name",
                        "content")
VALUES (2,'Web development category','Web development','How to become a web developer'),
       (2,'Database category','Database','How to become a database administrator');