import { server, invoke } from './common';

export const reviewService = {
    getByStudentId: (studentId: number) => invoke<Review[]>(server.get(`/api/reviews/${studentId}`)),
    getListCoursesByStudentId: (studentId: number) => invoke<Course[]>(server.get(`/api/students/${studentId}/courses`)),
    create: (payload: ReviewCreationPayload) => invoke<{ message: string }>(server.post('/api/reviews', payload)),
    update: (payload: ReviewCreationPayload) => invoke<{ message: string }>(server.put('/api/reviews', payload)),
    delete: (studentId: number, courseId: number) => invoke<{ message: string }>(server.delete(`/api/reviews/${studentId}/${courseId}`)),
    getListCoursesByInstructorId: (instructorId: number) =>
        invoke<InstructorCourse[]>(server.get(`/api/instructors/${instructorId}/courses/top`)),
    filterAndSortCourses: (instructorId: number, payload: FilterAndSortPayload) =>
        invoke<InstructorCourse[]>(server.post(`/api/instructors/${instructorId}/courses/filter`, payload))
};
