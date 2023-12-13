import { InsertReviewDto, StudentIdDto } from '@be/dtos/in';
import { CourseDto, OkDto } from '@be/dtos/out';
import { Handler } from '@be/interfaces';
import { courseQuery, reviewQuery } from '@be/queries';

const getAllCourse: Handler<CourseDto[], { Params: StudentIdDto }> = async (req, res) => {
    const studentId = req.params.studentId;
    console.log('BEGIN BUG');
    console.log(studentId);
    console.log('END BUG');
    const courses = await courseQuery.getCoursesByStudentId(studentId);
    if (courses.length === 0) return res.internalServerError('Không tìm thấy khóa học nào !');
    return res.status(200).send(courses);
};

const insertReview: Handler<OkDto, { Body: InsertReviewDto }> = async (req, res) => {
    const reviewData = req.body;
    const isSucessful = await reviewQuery.insertReview(reviewData);
    if (!isSucessful) return res.internalServerError('Thêm đánh giá thất bại !');
    return res.status(200).send({ message: 'Thêm đánh giá thành công !' });
};

export const userHandler = {
    getAllCourse: getAllCourse,
    insertReview: insertReview
};
