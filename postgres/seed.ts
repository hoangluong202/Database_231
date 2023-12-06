import { hashSync } from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

const SALT_ROUNDS = 10;
const password = hashSync('password', SALT_ROUNDS);
const avatarUrl = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';

const sampleUser = [
    {
        text: `INSERT INTO users(email, password, first_name, last_name,avatar_url) VALUES($1, $2, $3, $4, $5)`,
        values: ['hluong@gmail.com', password, 'Hoang', 'Luong', avatarUrl]
    },
    {
        text: `INSERT INTO users(email, password, first_name, last_name,avatar_url) VALUES($1, $2, $3, $4, $5)`,
        values: ['nnphu@gmail.com', password, 'Nguyen Ngoc', 'Phu', avatarUrl]
    },
    {
        text: `INSERT INTO users(email, password, first_name, last_name,avatar_url) VALUES($1, $2, $3, $4, $5)`,
        values: ['lvu@gmail.com', password, 'Lam', 'Vu', avatarUrl]
    },
    {
        text: `INSERT INTO users(email, password, first_name, last_name,avatar_url) VALUES($1, $2, $3, $4, $5)`,
        values: ['ntduy@gmail.com', password, 'Nguyen Tuan', 'Duy', avatarUrl]
    },
    {
        text: `INSERT INTO users(email, password, first_name, last_name,avatar_url) VALUES($1, $2, $3, $4, $5)`,
        values: ['tmthuany@gmail.com', password, 'Tran Minh', 'Thuan', avatarUrl]
    }
];

async function seed() {
    //seed users
    sampleUser;
    // for (const user of sampleUser) {
    //     try {
    //         await pool.query(user);
    //     } catch (error) {
    //         console.log(user);
    //         console.log(error);
    //         return;
    //     }
    // }
    //const text = `SELECT id, email, lastName", "public"."User"."firstName" FROM "public"."User" WHERE "public"."User"."email" = $1 LIMIT $2 OFFSET $3`
    const res = await pool.query({
        text: 'SELECT id, email, password FROM users WHERE email = $1',
        values: ['hluong@gmail.com']
    });
    const user = res.rows[0];
    console.log(user);
}
seed();
