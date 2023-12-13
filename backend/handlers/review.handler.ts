import { StudentIdDto, InsertReviewDto, DeleteReviewDto } from '@be/dtos/in';
import { ReviewResultDto, OkDto } from '@be/dtos/out';
import { Handler } from '@be/interfaces';
import { reviewQuery } from '@be/queries';

const getReviewByStudentId: Handler<ReviewResultDto[], { Params: StudentIdDto }> = async (req, res) => {
    const studentId = req.params.studentId;
    const reviews = await reviewQuery.getReviewByStudentId(studentId);
    if (reviews.length === 0) return res.internalServerError('Không tìm thấy reviews nào !');
    return res.status(200).send(reviews);
};

const insertReview: Handler<OkDto, { Body: InsertReviewDto }> = async (req, res) => {
    const reviewData = req.body;
    const isSucessful = await reviewQuery.insertReview(reviewData);
    if (!isSucessful) return res.internalServerError('Thêm đánh giá thất bại !');
    return res.status(200).send({ message: 'Thêm đánh giá thành công !' });
};

const updateReview: Handler<OkDto, { Body: InsertReviewDto }> = async (req, res) => {
    const reviewData = req.body;
    const isSucessful = await reviewQuery.updateReview(reviewData);
    if (!isSucessful) return res.internalServerError('Chỉnh sửa đánh giá thất bại !');
    return res.status(200).send({ message: 'Chỉnh sửa đánh giá thành công !' });
};

const deleteReview: Handler<OkDto, { Params: DeleteReviewDto }> = async (req, res) => {
    const reviewData = req.params;
    const isSucessful = await reviewQuery.deleteReview(reviewData);
    if (!isSucessful) return res.internalServerError('Xóa đánh giá thất bại !');
    return res.status(200).send({ message: 'Xóa đánh giá thành công !' });
};

export const reviewHandler = {
    getReviewByStudentId,
    insertReview,
    updateReview,
    deleteReview
};
