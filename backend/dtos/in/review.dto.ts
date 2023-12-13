import { Static, Type } from '@sinclair/typebox';

export const StudentIdDto = Type.Object({
    studentId: Type.Integer()
});

export type StudentIdDto = Static<typeof StudentIdDto>;
