import { Static, Type } from '@sinclair/typebox';

export const CourseTopDto = Type.Object({
    courseId: Type.Integer(),
    courseName: Type.String(),
    courseLabel: Type.String(),
    audienceLabel: Type.String(),
    updatedAt: Type.String(),
    totalDuration: Type.Integer(),
    sponsorName: Type.Union([Type.Null(), Type.String()]),
    priceDiscounted: Type.Union([Type.Null(), Type.Number()]),
    averageRating: Type.Union([Type.Null(), Type.String()])
});

export type CourseTopDto = Static<typeof CourseTopDto>;
