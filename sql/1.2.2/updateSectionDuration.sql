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

CREATE OR REPLACE TRIGGER total_duration_section_update AFTER
INSERT
OR
UPDATE OF duration
OR
DELETE ON "Lecture"
FOR EACH ROW EXECUTE FUNCTION update_total_duration_section();