type SlideData = {
  src: string;
  alt: string;
};
type ItemData = {
  id: string;
  image: string;
  subImage1: string;
  subImage2: string;
  name: string;
  discount: number;
  price: number;
  description: string;
  numberBought: number;
};
type HomeStore = {
  homeStatus: StoreStatus;
  slideData: SlideData[];
  itemData: ItemData[];
  getSlideData: () => Promise<void>;
  getItemData: () => Promise<void>;
};
