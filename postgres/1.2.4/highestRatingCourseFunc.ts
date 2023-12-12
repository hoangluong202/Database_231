import { AudienceLabel } from '@prisma/client';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://postgres:password@localhost:5432/postgres' });

async function highestRatingCourseFunc() {
    //1.2.4.1
    await pool.query(`
    CREATE OR REPLACE FUNCTION get_highest_rating_course(audience_label "AudienceLabel") RETURNS TABLE("name" VARCHAR, "averageRating" NUMERIC(10, 2)) AS $$
    DECLARE
    cou RECORD;
      max_course_name VARCHAR;
      max_average_rating NUMERIC(10,2) = 0;
    BEGIN
      -- check if audience label is NULL and raise exception
      IF audience_label IS NULL THEN
          RAISE EXCEPTION 'Audience label is null!';
      END IF;

      -- get all courses by audience label, if not found raise exception
      IF NOT EXISTS (SELECT * FROM "Course" WHERE "audienceLabel" = audience_label) THEN
          RAISE EXCEPTION 'Course with audience label % not found!', audience_label;
      END IF;

      -- in StudentReviewCourse, group by courseId and calculate average rating
      -- add a new column "averageRating" to result
      FOR cou IN
          SELECT "Course".id , "Course".name, AVG("StudentReviewCourse"."rating")::NUMERIC(10,2) AS "averageRating"
          FROM "Course"
          JOIN "StudentReviewCourse" ON "Course".id = "StudentReviewCourse"."courseId"
          WHERE "Course"."audienceLabel" = audience_label
          GROUP BY "Course".id
      LOOP
          IF cou."averageRating" > max_average_rating THEN
      max_course_name := cou.name;
              max_average_rating := cou."averageRating";
          END IF;
      END LOOP;

      -- return the course with the max rating or raise an exception if not found
      IF max_average_rating = 0 THEN
          RAISE EXCEPTION 'Course with audience label % not found review!', audience_label;
      END IF;
  RETURN QUERY SELECT max_course_name, max_average_rating;
    END;
    $$ LANGUAGE PLPGSQL;
  `);

    // Test
    const audienceLabel = AudienceLabel.Beginner;
    const res1 = await pool.query(
        `
    SELECT * FROM get_highest_rating_course($1);
    `,
        [audienceLabel]
    );
    console.log('Result of highest rating course:\n', res1.rows[0]);
    process.exit(0);
}
highestRatingCourseFunc();
