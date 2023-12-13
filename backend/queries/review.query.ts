import { DeleteReviewDto, InsertReviewDto } from '@be/dtos/in';
import { ReviewResultDto } from '@be/dtos/out';
import { logger, poolQuery } from '@be/utils';

const getReviewByStudentId = async (studentId: number): Promise<ReviewResultDto[]> => {
    try {
        const queryText = `SELECT * FROM get_review_by_student($1)`;
        const { rows } = await poolQuery({ text: queryText, values: [studentId] });
        return rows;
    } catch (err) {
        logger.error('Error when retrieving user data by Sdt');
        logger.error(err);
        throw err;
    }
};

const insertReview = async (reviewData: InsertReviewDto): Promise<boolean> => {
    try {
        const { studentId, courseId, rating, content } = reviewData;
        const queryText = `CALL insert_review($1, $2, $3, $4)`;
        await poolQuery({ text: queryText, values: [studentId, courseId, rating, content] });
        return true;
    } catch (err) {
        return false;
    }
};

const updateReview = async (reviewData: InsertReviewDto): Promise<boolean> => {
    try {
        const { studentId, courseId, rating, content } = reviewData;
        const queryText = `CALL update_review($1, $2, $3, $4)`;
        await poolQuery({ text: queryText, values: [studentId, courseId, rating, content] });
        return true;
    } catch (err) {
        return false;
    }
};

const deleteReview = async (reviewData: DeleteReviewDto): Promise<boolean> => {
    try {
        const { studentId, courseId } = reviewData;
        const queryText = `CALL delete_review($1, $2)`;
        await poolQuery({ text: queryText, values: [studentId, courseId] });
        return true;
    } catch (err) {
        return false;
    }
};

export const reviewQuery = { getReviewByStudentId, insertReview, updateReview, deleteReview };
