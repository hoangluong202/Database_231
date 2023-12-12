import axios, { AxiosError, AxiosResponse } from 'axios';
import createClient, { FetchResponse } from 'openapi-fetch';
import { paths } from '@api/spec';

export const apiClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: 'include'
});

export const mockServer = axios.create({
  baseURL: import.meta.env.VITE_MOCK_BACKEND_URL,
  withCredentials: true
});

export async function invoke<T = unknown>(call: Promise<FetchResponse<T>>) {
  const { data, error } = await call;
  if (data) return data;
  throw (error as ResponseError).message;
}

export async function invokeMockServer<R = unknown, D = unknown>(
  call: Promise<AxiosResponse<R, D>>
) {
  try {
    const response = await call;
    return response.data;
  } catch (err) {
    const e = err as AxiosError;
    const errPayload = e.response?.data ? (e.response.data as ResponseError) : e;
    throw errPayload;
  }
}
