import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

import { serializeToQuery } from './helper';

export interface IBaseApi {
  get: <R>(url: string, config?: AxiosRequestConfig) => Promise<AxiosRequestConfig<R>>;
  delete: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
  post: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
  put: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
  patch: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
}

export class BaseApi implements IBaseApi {
  private http: AxiosInstance;

  constructor(apiEndpoint: string) {
    this.http = axios.create({
      baseURL: apiEndpoint,
      paramsSerializer: serializeToQuery,
    });
  }

  get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.http.get(url, config);
  }

  delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.http.delete(url, config);
  }

  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.http.post(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.http.put(url, data, config);
  }

  patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.http.patch(url, data, config);
  }
}
