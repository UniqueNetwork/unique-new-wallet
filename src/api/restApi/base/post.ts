import axios, { defaultParams } from './axios';

const post = <T = any>(url: string, body: T, params = { ...defaultParams }) =>
  axios.post<T>(url, body, params);

export default post;
