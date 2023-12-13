import { Static, Type } from '@sinclair/typebox';

export const InstructorIdDto = Type.Object({
    instructorId: Type.Integer()
});

export type InstructorIdDto = Static<typeof InstructorIdDto>;
