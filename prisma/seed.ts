import { hashSync } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

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

// hoang luong: student
const user1 = {
    email: 'hoangluong@gmail.com',
    password: hashPassword,
    firstName: 'Hoang',
    lastName: 'Luong',
    avatarUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
};

async function generateSampleData() {
    const sampleUser = await prisma.user.create({
        data: user1
    });
    console.log();
    console.log(sampleUser);
    process.exit(0);
}

generateSampleData();
