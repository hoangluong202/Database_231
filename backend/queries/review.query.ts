import { ReviewResultDto } from '@be/dtos/out';
import { logger, poolQuery } from '@be/utils';

const getReviewByStudentId = async (studentId: number): Promise<ReviewResultDto[]> => {
    try {
        const queryText = `SELECT * FROM get_review_by_student($1)`;

        const { rows } = await poolQuery({ text: queryText, values: [studentId] });
        console.log('BEGIN BUG');
        console.log(rows);
        console.log('END BUG');

        return rows;
    } catch (err) {
        logger.error('Error when retrieving user data by Sdt');
        logger.error(err);
        throw err;
    }
};

export const reviewQuery = { getReviewByStudentId };
