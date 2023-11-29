import { Pool } from 'pg';
import { dropEnumTypes } from './schemaQueries/enum-types';
import { dropTables } from './schemaQueries/tables';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function drop() {
    const allQueriesDropTable = Object.entries(dropTables);
    for (const query of allQueriesDropTable) {
        try {
            await pool.query(query[1]);
        } catch (error) {
            console.log(query[1]);
            console.log(error);
        }
    }

    const allQueriesDropEnum = Object.entries(dropEnumTypes);
    for (const query of allQueriesDropEnum) {
        try {
            await pool.query(query[1]);
        } catch (error) {
            console.log(query[1]);
            console.log(error);
        }
    }
}
drop();
