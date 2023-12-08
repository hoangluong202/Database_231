import { hashSync } from 'bcrypt';
import { AudienceLabel, CourseLabel, PrismaClient } from '@prisma/client';

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
    firstName: 'Lam',
    lastName: 'Vu',
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
    firstName: 'Nguyen Ngoc',
    lastName: 'Phu',
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
                priceDiscounted: 425000
            }
        }
    };
    const paidCourseSqlId = await prisma.course.create({
        data: paidCourseSQL,
        select: { id: true }
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
                priceDiscounted: 850000,
                parentId: paidCourseSqlId.id
            }
        }
    };
    const paidCoursePostgresDBAId = await prisma.course.create({
        data: paidCoursePostgresDBA,
        select: { id: true }
    });

    const studentRegisteredCourse = [
        {
            studentId: luong.id,
            courseId: freeCourseHTMLId.id
        },
        {
            studentId: duy.id,
            courseId: freeCourseHTMLId.id
        },
        {
            studentId: luong.id,
            courseId: paidCourseSqlId.id
        },
        {
            studentId: duy.id,
            courseId: paidCourseSqlId.id
        },
        {
            studentId: thuan.id,
            courseId: paidCourseSqlId.id
        },
        {
            studentId: vu.id,
            courseId: paidCourseSqlId.id
        },
        {
            studentId: luong.id,
            courseId: paidCourseSqlId.id
        },
        {
            studentId: duy.id,
            courseId: paidCourseSqlId.id
        },
        {
            studentId: thuan.id,
            courseId: paidCourseSqlId.id
        },
        {
            studentId: vu.id,
            courseId: paidCoursePostgresDBAId.id
        }
    ];

    console.log(
        luong,
        duy,
        thuan,
        vu,
        phu,
        freeCourseHTMLId,
        paidCourseSqlId,
        paidCoursePostgresDBA,
        freeCourseHTMLId,
        paidCourseSqlId,
        paidCoursePostgresDBAId,
        studentRegisteredCourse
    );
    process.exit(0);
}

generateSampleData();
