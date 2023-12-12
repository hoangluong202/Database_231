type ModelStore = {
  modelStatus: StoreStatus;
  modelData: ItemData;
  getModelById: (modelId: string) => Promise<void>;
};
