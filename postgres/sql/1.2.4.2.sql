CREATE OR REPLACE FUNCTION get_revenue(YEAR INT) RETURNS TABLE(name VARCHAR, revenue INT) AS $$
      DECLARE
        pai_cou RECORD;
        total_revenue INT;
      BEGIN
        IF year IS NULL THEN
          RAISE EXCEPTION 'Year is null!';
        END IF;

        IF year < 0 THEN
          RAISE EXCEPTION 'Year is invalid!';
        END IF;

        FOR pai_cou IN
          SELECT "Course".id, "Course".name, "PaidCourse"."priceDiscounted"
          FROM "PaidCourse"
          LEFT JOIN "Course" ON "Course".id = "PaidCourse"."courseId"
        LOOP
          SELECT COALESCE(SUM("PaidCourse"."priceDiscounted"),0) INTO total_revenue
          FROM "PaidCourse"
          JOIN "PaidCourseOrder" ON "PaidCourseOrder"."paidCourseId" = "PaidCourse"."courseId"
          JOIN "Order" ON "Order".id = "PaidCourseOrder"."orderId"
          WHERE "PaidCourse"."courseId" = pai_cou.id AND EXTRACT(YEAR FROM "Order"."createdAt") = year;

          name := pai_cou.name;
          revenue := total_revenue;
          RETURN NEXT;
        END LOOP;
      END;
      $$ LANGUAGE PLPGSQL;