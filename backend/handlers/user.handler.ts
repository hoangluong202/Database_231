import { FilterSearchCourseDto, InstructorIdDto, StudentIdDto } from '@be/dtos/in';
import { CourseDto, CourseTopDto } from '@be/dtos/out';
import { Handler } from '@be/interfaces';
import { courseQuery } from '@be/queries';

const getAllCourse: Handler<CourseDto[], { Params: StudentIdDto }> = async (req, res) => {
    const studentId = req.params.studentId;
    const courses = await courseQuery.getCoursesByStudentId(studentId);
    console.log(courses);
    if (courses.length === 0) return res.internalServerError('Không tìm thấy khóa học nào !');
    return res.status(200).send(courses);
};

const getTopCourse: Handler<CourseTopDto[], { Params: InstructorIdDto }> = async (req, res) => {
    try {
        const instructorId = req.params.instructorId;
        const courses: CourseTopDto[] = await courseQuery.getTopCourses(instructorId);
        console.log(courses);
        return res.status(200).send(courses);
    } catch (err) {
        return res.internalServerError('Không tìm thấy khóa học nào !');
    }
};

const filterAndSortCourse: Handler<CourseTopDto[], { Params: InstructorIdDto; Body: FilterSearchCourseDto }> = async (req, res) => {
    try {
        const instructorId = req.params.instructorId;
        const queryFilterAndSort = req.body;
        console.log('start bug');
        console.log(queryFilterAndSort);
        console.log('end bug');
        const courses = await courseQuery.filterAndSortCourse(instructorId, queryFilterAndSort);
        console.log(courses);
        return res.status(200).send(courses);
    } catch (err) {
        return res.internalServerError('Không tìm thấy khóa học nào !');
    }
};

export const userHandler = {
    getAllCourse,
    getTopCourse,
    filterAndSortCourse
};
