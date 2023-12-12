import { mockServer, invokeMockServer } from './common';

export const homeService = {
  getSlide: () => invokeMockServer<SlideData[]>(mockServer.get('/slides')),
  getItem: () => invokeMockServer<ItemData[]>(mockServer.get('/items'))
};
