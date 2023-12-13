import { Static, Type } from '@sinclair/typebox';
// price can be null
export const OkDto = Type.Object({
    message: Type.String()
});

export type OkDto = Static<typeof OkDto>;
