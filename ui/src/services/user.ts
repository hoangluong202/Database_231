import { apiClient, invoke } from './common';

export const userService = {
  getInfo: () => invoke(apiClient.GET('/api/user'))
};
