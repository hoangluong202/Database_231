import { apiClient, invoke } from './common';

export const authService = {
  login: (data: LoginFormData) => invoke(apiClient.POST('/auth/login', { body: data })),
  logout: () => invoke(apiClient.DELETE('/auth/logout')),
  signUp: (data: SignUpFormData) => invoke(apiClient.POST('/auth/signup', { body: data })),
  createOTP: () => invoke(apiClient.POST('/auth/verify'))
};
