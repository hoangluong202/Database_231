import { Type } from '@sinclair/typebox';
import { ReviewResultDto, CourseDto } from '@be/dtos/out';
import { reviewHandler, userHandler } from '@be/handlers';
import { createRoutes } from '@be/utils';
import { RouteHandlerMethod } from 'fastify';

export const userPlugin = createRoutes('All', [
    {
        method: 'GET',
        url: '/review/:studentId',
        schema: {
            response: {
                200: Type.Array(ReviewResultDto)
            }
        },
        handler: reviewHandler.getReviewByStudentId as RouteHandlerMethod
    },
    {
        method: 'GET',
        url: '/students/:studentId/courses',
        schema: {
            response: {
                200: Type.Array(CourseDto)
            }
        },
        handler: userHandler.getAllCourse as RouteHandlerMethod
    }
]);
