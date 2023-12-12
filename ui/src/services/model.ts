import { mockServer, invokeMockServer } from './common';

export const modelService = {
  getById: (id: string) => invokeMockServer<ItemData>(mockServer.get(`/items/${id}`))
};
