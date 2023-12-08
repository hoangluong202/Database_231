import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function createTrigger() {
    // create trigger update priceDiscounted
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_paid_course_price()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW."priceDiscounted" := NEW."priceOriginal" * (100-NEW."discountPercentage")/100;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    await pool.query(`
    CREATE TRIGGER paid_course_price_update
      BEFORE INSERT OR UPDATE ON "PaidCourse"
      FOR EACH ROW
      EXECUTE FUNCTION update_paid_course_price();
  `);

    //create trigger update total section of course
}
createTrigger();
