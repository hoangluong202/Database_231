import { hashSync } from 'bcrypt';
import { AnswerOption, AudienceLabel, CourseLabel, MaterialType, PaymentMethod, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query'
        },
        {
            emit: 'stdout',
            level: 'error'
        },
        {
            emit: 'stdout',
            level: 'info'
        },
        {
            emit: 'stdout',
            level: 'warn'
        }
    ]
});

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
});

const SALT_ROUNDS = 10;
const PASSWORD = 'password';
const hashPassword = hashSync(PASSWORD, SALT_ROUNDS);

const userLuong = {
    email: 'hoangluong@gmail.com',
    password: hashPassword,
    firstName: 'Hoàng',
    lastName: 'Lương',
    avatarUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    student: {
        create: {
            target: 'Software Engineer'
        }
    }
};
const userDuy = {
    email: 'ntduy@gmail.com',
    password: hashPassword,
    firstName: 'Nguyễn Tuấn',
    lastName: 'Duy',
    avatarUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    student: {
        create: {
            target: 'Fullstack Developer'
        }
    }
};
const userThuan = {
    email: 'tmthuany@gmail.com',
    password: hashPassword,
    firstName: 'Trần Minh',
    lastName: 'Thuận',
    avatarUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    student: {
        create: {
            target: 'Software Engineer'
        }
    }
};
const userVu = {
    email: 'lvu@gmail.com',
    password: hashPassword,
    firstName: 'Lâm',
    lastName: 'Vũ',
    avatarUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    instructor: {
        create: {
            bankAccountNumber: '9374882123',
            position: 'Software Engineer At Google'
        }
    }
};
const userPhu = {
    email: 'nnphu@gmail.com',
    password: hashPassword,
    firstName: 'Nguyễn Ngọc',
    lastName: 'Phú',
    avatarUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    student: {
        create: {
            target: 'Database Administrator At Google'
        }
    },
    instructor: {
        create: {
            bankAccountNumber: '9374882124',
            position: 'AI Researcher At OpenAI'
        }
    }
};

async function generateSampleData() {
    const luong = await prisma.user.create({
        data: userLuong,
        select: { id: true }
    });
    const vu = await prisma.user.create({
        data: userVu,
        select: { id: true }
    });
    const phu = await prisma.user.create({
        data: userPhu,
        select: { id: true }
    });
    const duy = await prisma.user.create({
        data: userDuy,
        select: { id: true }
    });
    const thuan = await prisma.user.create({
        data: userThuan,
        select: { id: true }
    });

    const freeCourseHTML = {
        name: 'HTML for Beginners',
        description: 'Learn HTML to become a fullstack developer',
        courseLabel: CourseLabel.HighestRated,
        audienceLabel: AudienceLabel.Beginner,
        instructorId: vu.id,
        freeCourse: {
            create: {
                sponsorName: 'Google'
            }
        }
    };
    const freeCourseHTMLId = await prisma.course.create({
        data: freeCourseHTML,
        select: { id: true }
    });

    const paidCourseSQL = {
        name: 'SQL for Beginners',
        description: 'Learn SQL from zero to hero',
        courseLabel: CourseLabel.Bestseller,
        audienceLabel: AudienceLabel.Beginner,
        instructorId: phu.id,
        paidCourse: {
            create: {
                priceOriginal: 500000,
                discountPercentage: 15,
                priceDiscounted: 0
            }
        }
    };

    const paidCourseSqlId = await prisma.course.create({
        data: paidCourseSQL,
        select: { id: true }
    });

    //Seed section
    const sectionDDL = {
        name: 'Data Definition Language (DDL)',
        courseId: paidCourseSqlId.id,
        totalCompletionTime: 0,
        totalLectures: 0
    };
    const sectionDDLId = await prisma.section.create({
        data: sectionDDL,
        select: { id: true }
    });

    const sectionDML = {
        name: 'Data Manipulation Language (DML)',
        courseId: paidCourseSqlId.id,
        totalCompletionTime: 0,
        totalLectures: 0
    };
    const sectionDMLId = await prisma.section.create({
        data: sectionDML,
        select: { id: true }
    });

    // seed lecture with material or quiz
    const materialCreateTable = {
        name: 'Create Table',
        description: 'Learn how to create table in SQL',
        duration: 10000,
        sectionId: sectionDDLId.id,
        material: {
            create: {
                type: MaterialType.Video,
                name: 'Video tutorial',
                url: 'https://www.youtube.com/watch?v=QnBp4NjUQPU'
            }
        }
    };
    await prisma.lecture.create({
        data: materialCreateTable,
        select: { id: true }
    });

    const materialAlterTable = {
        name: 'Alter Table',
        description: 'Learn how to alter table in SQL',
        duration: 600,
        sectionId: sectionDDLId.id,
        material: {
            create: {
                type: MaterialType.Text,
                name: 'PDF tutorial',
                url: 'https://www.tutorialspoint.com/sql/sql-alter-command.htm'
            }
        }
    };

    await prisma.lecture.create({
        data: materialAlterTable,
        select: { id: true }
    });

    const quizInsert = {
        name: 'Quiz INSERT',
        description: 'Synthetic quiz for INSERT statement',
        duration: 600,
        sectionId: sectionDMLId.id,
        quiz: {
            create: {
                totalQuestions: 0
            }
        }
    };
    const quizInsertId = await prisma.lecture.create({
        data: quizInsert,
        select: { id: true }
    });

    //seed question
    const questionSyntaxInsert = {
        content: 'Which statement is correct?',
        correctOption: AnswerOption.D,
        quizId: quizInsertId.id
    };

    const questionSyntaxInsertId = await prisma.question.create({
        data: questionSyntaxInsert,
        select: { id: true }
    });

    //seed answer option
    const answerASyntaxInsert = {
        questionId: questionSyntaxInsertId.id,
        answerOption: AnswerOption.A,
        content: 'INSERT INTO table_name VALUES (value1, value2, value3, ...);',
        isCorrect: true,
        explanation: 'This is the correct syntax for INSERT statement'
    };
    await prisma.answer.create({
        data: answerASyntaxInsert
    });

    const answerBSyntaxInsert = {
        questionId: questionSyntaxInsertId.id,
        answerOption: AnswerOption.B,
        content: 'INSERT INTO table_name (column1, column2, column3, ...)',
        isCorrect: false,
        explanation: 'This is the incorrect syntax for INSERT statement'
    };
    await prisma.answer.create({
        data: answerBSyntaxInsert
    });

    const answerCSyntaxInsert = {
        questionId: questionSyntaxInsertId.id,
        answerOption: AnswerOption.C,
        content: 'INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);',
        isCorrect: false,
        explanation: 'This is the incorrect syntax for INSERT statement'
    };
    await prisma.answer.create({
        data: answerCSyntaxInsert
    });

    const answerDSyntaxInsert = {
        questionId: questionSyntaxInsertId.id,
        answerOption: AnswerOption.D,
        content: 'All of the above',
        isCorrect: false,
        explanation: 'This is the correct syntax for INSERT statement'
    };
    await prisma.answer.create({
        data: answerDSyntaxInsert
    });

    const paidCoursePostgresDBA = {
        name: 'PostgreSQL to in depth',
        description: 'Learn PostgreSQL to become a DBA',
        courseLabel: CourseLabel.Bestseller,
        audienceLabel: AudienceLabel.Intermediate,
        instructorId: phu.id,
        paidCourse: {
            create: {
                priceOriginal: 1000000,
                discountPercentage: 15,
                priceDiscounted: 0,
                parentId: paidCourseSqlId.id
            }
        }
    };

    const paidCoursePostgresDBAId = await prisma.course.create({
        data: paidCoursePostgresDBA,
        select: { id: true }
    });

    //seed student register free course
    const studentRegisterFreeCourse = [
        {
            studentId: luong.id,
            courseId: freeCourseHTMLId.id
        },
        {
            studentId: duy.id,
            courseId: freeCourseHTMLId.id
        }
    ];
    await prisma.studentRegisterFreeCourse.createMany({
        data: studentRegisterFreeCourse
    });

    //seed orders
    const luongOrders = {
        studentId: luong.id,
        totalCost: 0,
        paymentMethod: PaymentMethod.Cash
    };
    const luongOrdersId = await prisma.order.create({
        data: luongOrders,
        select: { id: true }
    });

    //seed order paid courses
    const luongOrdersPaidCourse = [
        {
            orderId: luongOrdersId.id,
            paidCourseId: paidCourseSqlId.id
        },
        {
            orderId: luongOrdersId.id,
            paidCourseId: paidCoursePostgresDBAId.id
        }
    ];
    await prisma.paidCourseOrder.createMany({
        data: luongOrdersPaidCourse
    });

    //seed student review course
    const studentReviewCourse = [
        {
            studentId: luong.id,
            courseId: freeCourseHTMLId.id,
            rating: 3,
            content: 'It is so easy'
        },
        {
            studentId: luong.id,
            courseId: paidCourseSqlId.id,
            rating: 5,
            content: 'This course is awesome'
        },
        {
            studentId: luong.id,
            courseId: paidCourseSqlId.id,
            rating: 4,
            content: 'This course is not bat'
        }
    ];
    await prisma.studentReviewCourse.createMany({
        data: studentReviewCourse
    });

    //seed certificate
    const certificates = [
        {
            courseId: paidCourseSqlId.id,
            content: 'Congratulation! You have completed SQL for Beginners course',
            expirationDate: new Date('2025-12-31')
        },
        {
            courseId: paidCoursePostgresDBAId.id,
            content: 'Congratulation! You have completed PostgreSQL to in depth course',
            expirationDate: new Date('2025-12-31')
        }
    ];
    await prisma.certificate.createMany({
        data: certificates
    });

    //seed category
    const category = [
        {
            name: 'Web development',
            content: 'How to become a web developer',
            description: 'Web development category',
            courseId: paidCourseSqlId.id
        },
        {
            name: 'Database',
            content: 'How to become a database administrator',
            description: 'Database category',
            courseId: paidCourseSqlId.id
        }
    ];
    await prisma.category.createMany({
        data: category
    });

    console.log('thuan', thuan);
    process.exit(0);
}

generateSampleData();
