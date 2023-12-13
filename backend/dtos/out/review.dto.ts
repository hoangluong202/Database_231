import { Static, Type } from '@sinclair/typebox';

export const ReviewResultDto = Type.Object({
    courseName: Type.String(),
    categoryName: Type.Array(Type.String()),
    rating: Type.Integer(),
    content: Type.String(),
    createdAt: Type.String()
});

export type ReviewResultDto = Static<typeof ReviewResultDto>;
