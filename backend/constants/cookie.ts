import { envs } from '@be/configs';

export const cookieOptions = {
    signed: false,
    secure: envs.isProduction,
    path: '/',
    httpOnly: true
};
