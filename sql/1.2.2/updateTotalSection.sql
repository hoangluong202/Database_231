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

CREATE OR REPLACE TRIGGER total_section_update AFTER
INSERT
OR
DELETE ON "Section"
FOR EACH ROW EXECUTE FUNCTION update_total_section();