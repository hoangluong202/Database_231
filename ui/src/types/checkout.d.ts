type CheckoutForm = {
  paymentMethod: PaymentMethod;
  district: string;
  ward: string;
  street: string;
  streetNo: string;
  note?: string;
};

type OrderData = {
  id: string;
  image: string;
  name: string;
  discount: number;
  price: number;
  numberBought: number;
};

type CheckoutStore = {
  checkoutStatus: StoreStatus;
  allOrder: OrderData[];
  getAllOrder: () => Promise<void>;
  updateOrder: (order: OrderData) => Promise<void>;
};
