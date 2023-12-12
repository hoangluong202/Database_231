import { create } from 'zustand';
import { checkoutService } from '@services';

export const useCheckoutStore = create<CheckoutStore>()((set, get) => ({
  checkoutStatus: 'UNINIT',
  allOrder: [],
  getAllOrder: async () => {
    set(() => ({ checkoutStatus: 'PENDING' }));
    try {
      const allOrder = await checkoutService.getAll();
      set(() => ({ allOrder: allOrder, checkoutStatus: 'SUCCESS' }));
    } catch (err) {
      set(() => ({ checkoutStatus: 'REJECT' }));
    }
  },
  updateOrder: async (order) => {
    set({ checkoutStatus: 'PENDING' });
    try {
      await checkoutService.update(order);
      get().getAllOrder();
      set(() => ({ checkoutStatus: 'SUCCESS' }));
    } catch (err) {
      set(() => ({ checkoutStatus: 'REJECT' }));
    }
  }
}));
