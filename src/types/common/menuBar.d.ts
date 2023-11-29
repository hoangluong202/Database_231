type MenuBarStore = {
  selectedMenu: string;
  isCategoryItem: boolean;
  selectedCategoryItem: string;
  setSelectedMenu: (selectedMenu: string) => void;
  setIsCategoryItem: (payload: boolean) => void;
  setSelectedCategoryItem: (payload: string) => void;
};
