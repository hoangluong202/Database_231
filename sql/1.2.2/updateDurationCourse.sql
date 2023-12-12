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

CREATE OR REPLACE TRIGGER total_duration_course_update AFTER
INSERT
OR
UPDATE OF "totalCompletionTime"
OR
DELETE ON "Section"
FOR EACH ROW EXECUTE FUNCTION update_total_course_duration();