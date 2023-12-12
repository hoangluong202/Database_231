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

CREATE OR REPLACE TRIGGER total_question_update AFTER
INSERT
OR
DELETE ON "Question"
FOR EACH ROW EXECUTE FUNCTION update_total_question();