import { create } from 'zustand';
import { modelService } from '@services';

export const useModelStore = create<ModelStore>()((set) => ({
  modelStatus: 'UNINIT',
  modelData: {
    id: '',
    image: '',
    subImage1: '',
    subImage2: '',
    name: '',
    discount: 0,
    price: 0,
    description: '',
    numberBought: 0
  },
  getModelById: async (modelId) => {
    set(() => ({ modelStatus: 'PENDING' }));
    try {
      const modelData = await modelService.getById(modelId);
      set(() => ({ modelData: modelData, modelStatus: 'SUCCESS' }));
    } catch (err) {
      set(() => ({ modelStatus: 'REJECT' }));
    }
  }
}));
