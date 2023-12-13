import { server, invoke } from './common';

export const reviewService = {
    getByStudentId: (studentId: number) => invoke<Review[]>(server.get(`/api/review/${studentId}`))
};
