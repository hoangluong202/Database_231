import { create } from 'zustand';
import { categoryService } from '@services';

export const useCategoryStore = create<CategoryStore>()((set) => ({
  categoryStatus: 'UNINIT',
  allCategory: [],
  getAllCategory: async () => {
    set(() => ({ categoryStatus: 'PENDING' }));
    try {
      const allCategory = await categoryService.getAll();
      set(() => ({ allCategory: allCategory, categoryStatus: 'SUCCESS' }));
    } catch (err) {
      set(() => ({ categoryStatus: 'REJECT' }));
    }
  }
}));
