import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function createTrigger() {
    // create trigger update priceDiscounted
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_paid_course_price() RETURNS TRIGGER AS $$
    BEGIN
      IF NEW."promoEndDate" IS NOT NULL AND NEW."promoEndDate" < NOW() THEN
        NEW."discountPercentage" := 0;
      END IF;
      NEW."priceDiscounted" := NEW."priceOriginal" * (100-NEW."discountPercentage")/100;
      RETURN NEW;
    END;
    $$ LANGUAGE PLPGSQL;
  `);
    await pool.query(`
    CREATE OR REPLACE TRIGGER paid_course_price_update
    BEFORE
    INSERT
    OR
    UPDATE OF "priceOriginal",
              "discountPercentage",
              "promoEndDate" ON "PaidCourse"
    FOR EACH ROW EXECUTE FUNCTION update_paid_course_price();
  `);

    //create trigger update total cost in Order with list course in PaidCourseOrder
    await pool.query(`

    CREATE OR REPLACE FUNCTION update_total_cost() RETURNS TRIGGER AS $$
    DECLARE
      order_id INT;
    BEGIN
        IF TG_OP = 'DELETE' THEN
            order_id := OLD."orderId";
        ELSE
            order_id := NEW."orderId";
        END IF;

        UPDATE "Order" o
        SET "totalCost" = (
            SELECT COALESCE(SUM("priceDiscounted"), 0)
            FROM "PaidCourse" pc
            JOIN "PaidCourseOrder" pco ON pc."courseId" = pco."paidCourseId"
            WHERE pco."orderId" = order_id
        )
        WHERE o.id = order_id;
		RETURN NULL;
    END;
    $$ LANGUAGE PLPGSQL;
      `);
    await pool.query(`
    CREATE OR REPLACE TRIGGER total_cost_update AFTER
    INSERT
    OR
    DELETE ON "PaidCourseOrder"
    FOR EACH ROW EXECUTE FUNCTION update_total_cost();
      `);

    //create trigger update total section of course
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_section() RETURNS TRIGGER AS $$
    DECLARE
      course_id INT;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        course_id := OLD."courseId";
      ELSE
        course_id := NEW."courseId";
      END IF;
      UPDATE "Course"
      SET "totalSections" = (
        SELECT COUNT(*)
        FROM "Section"
        WHERE "courseId" = course_id
    )
      WHERE id = course_id;
      RETURN NULL;
    END;
    $$ LANGUAGE PLPGSQL;
    `);

    await pool.query(`
    CREATE OR REPLACE TRIGGER total_section_update AFTER
    INSERT
    OR
    DELETE ON "Section"
    FOR EACH ROW EXECUTE FUNCTION update_total_section();
    `);

    //create trigger update total lecture of section
    await pool.query(`
     CREATE OR REPLACE FUNCTION update_total_lecture() RETURNS TRIGGER AS $$
     DECLARE
     section_id INT;
        BEGIN
      IF TG_OP = 'DELETE' THEN
      section_id := OLD."sectionId";
      ELSE
      section_id := NEW."sectionId";
      END IF;
          UPDATE "Section"
          SET "totalLectures" = (SELECT COUNT(*) FROM "Lecture" WHERE "sectionId" = section_id)
          WHERE id = section_id;
          RETURN NULL;
        END;
        $$ LANGUAGE PLPGSQL;
     `);
    await pool.query(`
     CREATE OR REPLACE TRIGGER total_lecture_update AFTER
     INSERT
     OR
     DELETE ON "Lecture"
     FOR EACH ROW EXECUTE FUNCTION update_total_lecture();
     `);

    //create trigger update total question of quiz
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_question() RETURNS TRIGGER AS $$
    DECLARE
      quiz_id INT;
    BEGIN

      IF TG_OP = 'DELETE' THEN
        quiz_id := OLD."quizId";
      ELSE
        quiz_id := NEW."quizId";
      END IF;

      UPDATE "Quiz"
      SET "totalQuestions" = (SELECT COUNT(*) FROM "Question" WHERE "quizId" = quiz_id)
      WHERE "lectureId" = quiz_id;
      RETURN NULL;
    END;
    $$ LANGUAGE PLPGSQL;
    `);
    await pool.query(`
    CREATE OR REPLACE TRIGGER total_question_update AFTER
    INSERT
    OR
    DELETE ON "Question"
    FOR EACH ROW EXECUTE FUNCTION update_total_question();
    `);

    //create trigger to update correct answer of question
    await pool.query(`
     CREATE OR REPLACE FUNCTION update_correct_answer() RETURNS TRIGGER AS $$
     BEGIN
       UPDATE "Question"
       SET "correctOption" = COALESCE((SELECT "answerOption" FROM "Answer" WHERE "questionId" = NEW."questionId" AND "isCorrect" = TRUE LIMIT 1),'A')
       WHERE id = NEW."questionId";
       RETURN NULL;
     END;
     $$ LANGUAGE PLPGSQL;
     `);
    await pool.query(`
     CREATE OR REPLACE TRIGGER correct_answer_update AFTER
     INSERT
     OR
     UPDATE OF "isCorrect" ON "Answer"
     FOR EACH ROW EXECUTE FUNCTION update_correct_answer();
     `);

    //create trigger update total duration of section
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_duration_section() RETURNS TRIGGER AS $$
    DECLARE
      section_id INT;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        section_id := OLD."sectionId";
      ELSE
        section_id := NEW."sectionId";
      END IF;

      UPDATE "Section"
      SET "totalCompletionTime" = (
        SELECT SUM("duration")
        FROM "Lecture"
        WHERE "sectionId" = section_id
    )
      WHERE id = section_id;
      RETURN NULL;
    END;
    $$ LANGUAGE PLPGSQL;
    `);
    await pool.query(`
    CREATE OR REPLACE TRIGGER total_duration_section_update AFTER
    INSERT
    OR
    UPDATE OF duration
    OR
    DELETE ON "Lecture"
    FOR EACH ROW EXECUTE FUNCTION update_total_duration_section();
    `);

    //create trigger update total duration of course
    await pool.query(`
    CREATE OR REPLACE FUNCTION update_total_course_duration() RETURNS TRIGGER AS $$
    DECLARE
      course_id INT;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        course_id := OLD."courseId";
      ELSE
        course_id := NEW."courseId";
      END IF;

      UPDATE "Course"
      SET "totalDuration" = (
        SELECT SUM("totalCompletionTime")
        FROM "Section"
        WHERE "courseId" = course_id
    )
      WHERE id = course_id;
      RETURN NULL;
    END;
    $$ LANGUAGE PLPGSQL;
    `);

    await pool.query(`
    CREATE OR REPLACE TRIGGER total_duration_course_update AFTER
    INSERT
    OR
    UPDATE OF "totalCompletionTime"
    OR
    DELETE ON "Section"
    FOR EACH ROW EXECUTE FUNCTION update_total_course_duration();
    `);

    process.exit(0);
}
createTrigger();
