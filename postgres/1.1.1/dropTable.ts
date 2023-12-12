import * as pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function dropTable() {
    //using pool to query dropt all table from file table.sql
    await pool.query(`DROP TABLE IF EXISTS "User" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Student" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Instructor" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Course" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Certificate" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "FreeCourse" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "PaidCourse" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Section" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Lecture" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Material" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Quiz" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Question" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Order" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Category" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "StudentReviewCourse" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "StudentRegisterFreeCourse" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "PaidCourseOrder" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Answer" CASCADE`);
    //using pool to query dropt all type from file type.sql
    await pool.query(`DROP TYPE IF EXISTS "CourseLabel"`);
    await pool.query(`DROP TYPE IF EXISTS "AudienceLabel"`);
    await pool.query(`DROP TYPE IF EXISTS "MaterialType"`);
    await pool.query(`DROP TYPE IF EXISTS "AnswerOption"`);
    await pool.query(`DROP TYPE IF EXISTS "PaymentMethod"`);

    process.exit(0);
}
dropTable();
