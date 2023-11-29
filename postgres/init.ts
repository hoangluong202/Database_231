import { Pool } from 'pg';
import { enumTypes } from './schemaQueries/enum-types';
import { createTables } from './schemaQueries/tables';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function init() {
    // Create all enum types
    const allQueriesCreateEnum = Object.entries(enumTypes);
    for (const query of allQueriesCreateEnum) {
        try {
            await pool.query(query[1]);
        } catch (error) {
            console.log(query[1]);
            console.log(error);
            return;
        }
    }

    // Create all tables
    const allQueriesCreateTable = Object.entries(createTables);
    for (const query of allQueriesCreateTable) {
        try {
            await pool.query(query[1]);
        } catch (error) {
            console.log(query[1]);
            console.log(error);
            return;
        }
    }
}
init();
