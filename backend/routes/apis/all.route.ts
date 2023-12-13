import { Type } from '@sinclair/typebox';
import { ReviewResultDto, CourseDto, OkDto, CourseTopDto } from '@be/dtos/out';
import { reviewHandler, userHandler } from '@be/handlers';
import { createRoutes } from '@be/utils';
import { RouteHandlerMethod } from 'fastify';
import { FilterSearchCourseDto, InsertReviewDto } from '@be/dtos/in';

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
        url: '/reviews/:studentId/:courseId',
        schema: {
            response: {
                200: OkDto
            }
        },
        handler: reviewHandler.deleteReview as RouteHandlerMethod
    },
    {
        method: 'GET',
        url: '/instructors/:instructorId/courses/top',
        schema: {
            response: {
                200: Type.Array(CourseTopDto)
            }
        },
        handler: userHandler.getTopCourse as RouteHandlerMethod
    },
    {
        method: 'POST',
        url: '/instructors/:instructorId/courses/filter',
        schema: {
            body: FilterSearchCourseDto,
            response: {
                200: Type.Array(CourseTopDto)
            }
        },
        handler: userHandler.filterAndSortCourse as RouteHandlerMethod
    }
]);
