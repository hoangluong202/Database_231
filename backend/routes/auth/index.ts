//import { AuthInputDto } from '@be/dtos/in';
//import { AuthResultDto } from '@be/dtos/out';
//import { authHandler } from '@be/handlers';
import { createRoutes } from '@be/utils';

export const authPlugin = createRoutes('Auth', [
    // {
    //     method: 'POST',
    //     url: '/login',
    //     schema: {
    //         body: AuthInputDto,
    //         response: {
    //             200: AuthResultDto
    //         }
    //     },
    //     handler: authHandler.login
    // },
    // {
    //     method: 'POST',
    //     url: '/signup',
    //     schema: {
    //         body: AuthInputDto,
    //         response: {
    //             200: AuthResultDto
    //         }
    //     },
    //     handler: authHandler.signup
    // }
]);
