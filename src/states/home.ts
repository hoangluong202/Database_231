import { create } from 'zustand';
import { homeService } from '@services';

export const useHomeStore = create<HomeStore>()((set) => ({
  homeStatus: 'UNINIT',
  slideData: [],
  itemData: [],
  getSlideData: async () => {
    set(() => ({ homeStatus: 'PENDING' }));
    try {
      const slideData = await homeService.getSlide();
      set(() => ({ slideData: slideData, homeStatus: 'SUCCESS' }));
    } catch (err) {
      set(() => ({ homeStatus: 'REJECT' }));
    }
  },
  getItemData: async () => {
    set({ homeStatus: 'PENDING' });
    try {
      const itemData = await homeService.getItem();
      set(() => ({ itemData: itemData, homeStatus: 'SUCCESS' }));
    } catch (err) {
      set(() => ({ homeStatus: 'REJECT' }));
    }
  }
}));
