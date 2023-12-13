import { Static, Type } from '@sinclair/typebox';
// price can be null
export const CourseDto = Type.Object({
    image: Type.String(),
    name: Type.String(),
    price: Type.Union([Type.Null(), Type.Number()]),
    sponsor: Type.Union([Type.Null(), Type.String()]),
    description: Type.String()
});

export type CourseDto = Static<typeof CourseDto>;
