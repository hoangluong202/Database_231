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
    CREATE OR REPLACE TRIGGER paid_course_price_update
      BEFORE INSERT OR UPDATE ON "PaidCourse"
      FOR EACH ROW
      EXECUTE FUNCTION update_paid_course_price();
  `);

    //create trigger update total section of course
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_section()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE "Course"
      SET "totalSections" = (SELECT COUNT(*) FROM "Section" WHERE "courseId" = NEW."courseId")
      WHERE id = NEW."courseId";
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`);

    await pool.query(`
    CREATE OR REPLACE TRIGGER total_section_update
      AFTER INSERT OR DELETE ON "Section"
      FOR EACH ROW
      EXECUTE FUNCTION update_total_section();
    `);

    //create trigger update total duration of course
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_duration()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE "Course"
      SET "totalDuration" = (
        SELECT SUM("totalCompletionTime")
        FROM "Section"
        WHERE "courseId" = NEW."courseId"
    )
      WHERE id = NEW."courseId";
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
    CREATE OR REPLACE TRIGGER total_duration_update
      AFTER INSERT OR UPDATE OR DELETE ON "Section"
      FOR EACH ROW
      EXECUTE FUNCTION update_total_duration();
    `);

    //create trigger update total lecture of section
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_lecture()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE "Section"
      SET "totalLectures" = (SELECT COUNT(*) FROM "Lecture" WHERE "sectionId" = NEW."sectionId")
      WHERE id = NEW."sectionId";
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);
    await pool.query(`
    CREATE OR REPLACE TRIGGER total_lecture_update
      AFTER INSERT OR DELETE ON "Lecture"
      FOR EACH ROW
      EXECUTE FUNCTION update_total_lecture();
    `);

    //create trigger update total duration of section
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_duration_section()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE "Section"
      SET "totalCompletionTime" = (
        SELECT SUM("duration")
        FROM "Lecture"
        WHERE "sectionId" = NEW."sectionId"
    )
      WHERE id = NEW."sectionId";
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);
    await pool.query(`
    CREATE OR REPLACE TRIGGER total_duration_section_update
      AFTER INSERT OR UPDATE OR DELETE ON "Lecture"
      FOR EACH ROW
      EXECUTE FUNCTION update_total_duration_section();
    `);

    //create trigger update total question of quiz
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_question()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE "Quiz"
      SET "totalQuestions" = (SELECT COUNT(*) FROM "Question" WHERE "quizId" = NEW."quizId")
      WHERE id = NEW."quizId";
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);
    await pool.query(`
    CREATE OR REPLACE TRIGGER total_question_update
      AFTER INSERT OR DELETE ON "Question"
      FOR EACH ROW
      EXECUTE FUNCTION update_total_question();
    `);
    //create trigger update total cost in Order with list course in PaidCourseOrder
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_cost()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE "Order" o
      SET "totalCost" = (
        SELECT COALESCE(SUM("priceDiscounted"),0)
        FROM "PaidCourse" pc
        JOIN "PaidCourseOrder" pco ON pc."courseId" = pco."paidCourseId"
        WHERE pco."orderId" = o.id
    )
      WHERE o.id = NEW."orderId";
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
    CREATE OR REPLACE TRIGGER total_cost_update
      AFTER INSERT OR UPDATE OR DELETE ON "PaidCourseOrder"
      FOR EACH ROW
      EXECUTE FUNCTION update_total_cost();
    `);
}
createTrigger();
