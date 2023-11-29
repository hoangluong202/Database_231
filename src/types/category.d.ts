type CategoryStore = {
  categoryStatus: StoreStatus;
  allCategory: ItemData[];
  getAllCategory: () => Promise<void>;
};
