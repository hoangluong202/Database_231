CREATE OR REPLACE FUNCTION update_paid_course_price() RETURNS TRIGGER AS $$
    BEGIN
      IF NEW."promoEndDate" IS NOT NULL AND NEW."promoEndDate" < NOW() THEN
        NEW."discountPercentage" := 0;
      END IF;
      NEW."priceDiscounted" := NEW."priceOriginal" * (100-NEW."discountPercentage")/100;
      RETURN NEW;
    END;
    $$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER paid_course_price_update
BEFORE
INSERT
OR
UPDATE OF "priceOriginal",
          "discountPercentage",
          "promoEndDate" ON "PaidCourse"
FOR EACH ROW EXECUTE FUNCTION update_paid_course_price();