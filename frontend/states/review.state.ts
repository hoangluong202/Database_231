import { create } from 'zustand';
import { reviewService } from '@fe/services';

export const useReviewStore = create<ReviewStore>()((set, get) => ({
    reviewStatus: 'UNINIT',
    courseStatus: 'UNINIT',
    reviewData: [],
    listCourses: [],
    listInstructorCourses: [],
    getReviewByStudentId: async (studentId) => {
        set({ reviewStatus: 'PENDING' });
        try {
            const data = await reviewService.getByStudentId(studentId);
            set({ reviewData: data, reviewStatus: 'SUCCESS' });
        } catch (err) {
            set({ reviewStatus: 'REJECT' });
        }
    },
    getListCoursesByStudentId: async (studentId) => {
        set({ courseStatus: 'PENDING' });
        try {
            const data = await reviewService.getListCoursesByStudentId(studentId);
            set({ listCourses: data, courseStatus: 'SUCCESS' });
        } catch (err) {
            set({ courseStatus: 'REJECT' });
        }
    },
    createReview: async (payload) => {
        set({ reviewStatus: 'PENDING' });
        try {
            await reviewService.create(payload);
            await get().getListCoursesByStudentId(payload.studentId);
            await get().getReviewByStudentId(payload.studentId);
            set({ reviewStatus: 'SUCCESS' });
        } catch (err) {
            set({ reviewStatus: 'REJECT' });
        }
    },
    updateReview: async (payload) => {
        set({ reviewStatus: 'PENDING' });
        try {
            await reviewService.update(payload);
            await get().getReviewByStudentId(payload.studentId);
            set({ reviewStatus: 'SUCCESS' });
        } catch (err) {
            set({ reviewStatus: 'REJECT' });
        }
    },
    deleteReview: async (studentId, courseId) => {
        set({ reviewStatus: 'PENDING' });
        try {
            await reviewService.delete(studentId, courseId);
            await get().getReviewByStudentId(studentId);
            set({ reviewStatus: 'SUCCESS' });
        } catch (err) {
            set({ reviewStatus: 'REJECT' });
        }
    },
    getListCoursesByInstructorId: async (instructorId) => {
        set({ courseStatus: 'PENDING' });
        try {
            const data = await reviewService.getListCoursesByInstructorId(instructorId);
            set({ listInstructorCourses: data, courseStatus: 'SUCCESS' });
        } catch (err) {
            set({ courseStatus: 'REJECT' });
        }
    },
    filterAndSortCourses: async (instructorId, payload) => {
        set({ courseStatus: 'PENDING' });
        try {
            const data = await reviewService.filterAndSortCourses(instructorId, payload);
            set({ listInstructorCourses: data, courseStatus: 'SUCCESS' });
        } catch (err) {
            set({ courseStatus: 'REJECT' });
        }
    }
}));
