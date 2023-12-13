import { Type } from '@sinclair/typebox';
import { ReviewResultDto, CourseDto, OkDto } from '@be/dtos/out';
import { reviewHandler, userHandler } from '@be/handlers';
import { createRoutes } from '@be/utils';
import { RouteHandlerMethod } from 'fastify';
import { DeleteReviewDto, InsertReviewDto } from '@be/dtos/in';

export const userPlugin = createRoutes('All', [
    {
        method: 'GET',
        url: '/reviews/:studentId',
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
    },
    {
        method: 'POST',
        url: '/reviews',
        schema: {
            body: InsertReviewDto,
            response: {
                200: OkDto
            }
        },
        handler: reviewHandler.insertReview as RouteHandlerMethod
    },
    {
        method: 'PUT',
        url: '/reviews',
        schema: {
            body: InsertReviewDto,
            response: {
                200: OkDto
            }
        },
        handler: reviewHandler.updateReview as RouteHandlerMethod
    },
    {
        method: 'DELETE',
        url: '/reviews',
        schema: {
            body: DeleteReviewDto,
            response: {
                200: OkDto
            }
        },
        handler: reviewHandler.deleteReview as RouteHandlerMethod
    }
]);
