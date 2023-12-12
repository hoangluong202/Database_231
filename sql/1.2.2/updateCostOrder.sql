
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

CREATE OR REPLACE TRIGGER total_cost_update AFTER
INSERT
OR
DELETE ON "PaidCourseOrder"
FOR EACH ROW EXECUTE FUNCTION update_total_cost();