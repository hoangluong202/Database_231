//import { UserDto } from '@be/dtos/out';
//import { usersHandler } from '@be/handlers';
import { createRoutes } from '@be/utils';

export const userPlugin = createRoutes('User', [
    // {
    //     method: 'GET',
    //     url: '',
    //     schema: {
    //         response: {
    //             200: UserDto
    //         }
    //     },
    //     handler: usersHandler.getUserById
    // }
]);
