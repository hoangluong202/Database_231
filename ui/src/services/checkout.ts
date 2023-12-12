import { mockServer, invokeMockServer } from './common';

export const checkoutService = {
  getAll: () => invokeMockServer<OrderData[]>(mockServer.get('/orders')),
  update: (order: OrderData) =>
    invokeMockServer<OrderData>(mockServer.put(`/orders/${order.id}`, order))
};
