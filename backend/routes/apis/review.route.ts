import { Type } from '@sinclair/typebox';
import { ReviewResultDto } from '@be/dtos/out';
import { reviewHandler } from '@be/handlers';
import { createRoutes } from '@be/utils';
import { RouteHandlerMethod } from 'fastify';

export const userPlugin = createRoutes('Review', [
    {
        method: 'GET',
        url: '/:studentId',
        schema: {
            response: {
                200: Type.Array(ReviewResultDto)
            }
        },
        handler: reviewHandler.getReviewByStudentId as RouteHandlerMethod
    }
]);
