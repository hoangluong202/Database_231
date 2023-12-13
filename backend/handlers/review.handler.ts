import { StudentIdDto } from '@be/dtos/in';
import { ReviewResultDto } from '@be/dtos/out';
import { Handler } from '@be/interfaces';
import { reviewQuery } from '@be/queries';

const getReviewByStudentId: Handler<ReviewResultDto[], { Params: StudentIdDto }> = async (req, res) => {
    const studentId = req.params.studentId;
    const reviews = await reviewQuery.getReviewByStudentId(studentId);
    if (reviews.length === 0) return res.internalServerError('Không tìm thấy reviews nào !');
    return res.status(200).send(reviews);
};

export const reviewHandler = {
    getReviewByStudentId
};
