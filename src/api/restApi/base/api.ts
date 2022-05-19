import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

import config from '@app/config';

import { serializeToQuery } from './helper';

class BaseApi {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: config.uniqueApiUrl,
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

export const Api = new BaseApi();
