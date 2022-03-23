import axios, { AxiosRequestConfig } from 'axios';
import config from '../../../config';
import { serializeToQuery } from './helper';

const axiosInstance = axios;

// we can put some default params here for future (ex. cookies/headers)
export const defaultParams: AxiosRequestConfig = {
  baseURL: config.uniqueApiUrl,
  paramsSerializer: serializeToQuery
  // headers: { Authorization: localStorage.getItem('token') },
};

export default axiosInstance;
