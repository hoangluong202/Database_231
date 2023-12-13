import { Static, Type } from '@sinclair/typebox';

export const DeleteReviewDto = Type.Object({
    studentId: Type.Integer(),
    courseId: Type.Integer()
});

export type DeleteReviewDto = Static<typeof DeleteReviewDto>;
