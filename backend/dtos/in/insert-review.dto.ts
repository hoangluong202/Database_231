import { Static, Type } from '@sinclair/typebox';

export const InsertReviewDto = Type.Object({
    studentId: Type.Integer(),
    courseId: Type.Integer(),
    rating: Type.Integer(),
    content: Type.String()
});

export type InsertReviewDto = Static<typeof InsertReviewDto>;
