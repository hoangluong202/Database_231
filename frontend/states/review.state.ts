import { create } from 'zustand';
import { reviewService } from '@fe/services';

export const useReviewStore = create<ReviewStore>()((set) => ({
    reviewStatus: 'UNINIT',
    reviewData: [],
    getReviewByStudentId: async (studentId) => {
        set(() => ({ reviewStatus: 'PENDING' }));
        try {
            const data = await reviewService.getByStudentId(studentId);
            set(() => ({ reviewData: data, reviewStatus: 'SUCCESS' }));
        } catch (err) {
            set(() => ({ reviewStatus: 'REJECT' }));
        }
    }
}));
