import { StudentIdDto } from '@be/dtos/in';
import { CourseDto } from '@be/dtos/out';
import { Handler } from '@be/interfaces';
import { courseQuery } from '@be/queries';

const getAllCourse: Handler<CourseDto[], { Params: StudentIdDto }> = async (req, res) => {
    const studentId = req.params.studentId;
    console.log('BEGIN BUG');
    console.log(studentId);
    console.log('END BUG');
    const courses = await courseQuery.getCoursesByStudentId(studentId);
    if (courses.length === 0) return res.internalServerError('Không tìm thấy khóa học nào !');
    return res.status(200).send(courses);
};

export const userHandler = {
    getAllCourse: getAllCourse
};
