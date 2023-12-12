CREATE OR REPLACE FUNCTION update_correct_answer() RETURNS TRIGGER AS $$
     BEGIN
       UPDATE "Question"
       SET "correctOption" = COALESCE((SELECT "answerOption" FROM "Answer" WHERE "questionId" = NEW."questionId" AND "isCorrect" = TRUE LIMIT 1),'A')
       WHERE id = NEW."questionId";
       RETURN NULL;
     END;
     $$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER correct_answer_update AFTER
INSERT
OR
UPDATE OF "isCorrect" ON "Answer"
FOR EACH ROW EXECUTE FUNCTION update_correct_answer();