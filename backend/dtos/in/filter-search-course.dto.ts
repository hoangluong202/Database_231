import { Static, Type } from '@sinclair/typebox';

export const FilterSearchCourseDto = Type.Object({
    courseLabels: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
    audienceLabels: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
    sponsorName: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
    sortColumns: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
    sortOrders: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
    minAverageRating: Type.Optional(Type.Union([Type.Number(), Type.Null()]))
});

export type FilterSearchCourseDto = Static<typeof FilterSearchCourseDto>;
