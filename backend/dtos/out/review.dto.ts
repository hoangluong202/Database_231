import { Static, Type } from '@sinclair/typebox';

export const ReviewResultDto = Type.Object({
    courseName: Type.String(),
    categoryName: Type.String(),
    rating: Type.Integer(),
    content: Type.String(),
    createdAt: Type.Date()
});

export type ReviewResultDto = Static<typeof ReviewResultDto>;
