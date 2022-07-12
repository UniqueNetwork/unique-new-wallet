import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

import { serializeToQuery } from './helper';

export interface IBaseApi {
  readonly baseURL?: string;
  get: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
  delete: <R, D>(url: string, data: D, config?: AxiosRequestConfig) => Promise<R>;
  post: <R, D>(url: string, data: D, config?: AxiosRequestConfig) => Promise<R>;
  put: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
  patch: <R, D>(url: string, data: D, config?: AxiosRequestConfig) => Promise<R>;
}

export class BaseApi implements IBaseApi {
  private http: AxiosInstance;
  get baseURL() {
    return this.http.defaults.baseURL;
  }

  constructor(apiEndpoint: string) {
    this.http = axios.create({
      baseURL: apiEndpoint,
      paramsSerializer: serializeToQuery,
    });
  }

  async get<T = any, R = AxiosResponse<T>['data'], D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const response = await this.http.get(url, config);

    return response.data;
  }

  async delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const response = await this.http.delete(url, { ...config, data });

    return response.data;
  }

  async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const response = await this.http.post(url, data, config);

    return response.data;
  }

  async put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const response = await this.http.put(url, data, config);

    return response.data;
  }

  async patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const response = await this.http.patch(url, data, config);

    return response.data;
  }
}
