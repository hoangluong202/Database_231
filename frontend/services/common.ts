import { Pool, QueryConfig } from 'pg';

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'postgres'
});

export const invokeQuery = async (queryTextOrConfig: string | QueryConfig) => {
    try {
        console.log('Hello');
        const result = await pool.query(queryTextOrConfig);
        return result;
    } catch (err) {
        throw err;
    }
};
