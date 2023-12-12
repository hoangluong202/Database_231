import { mockServer, invokeMockServer } from './common';

export const categoryService = {
  getAll: () => invokeMockServer<ItemData[]>(mockServer.get('/items'))
};
