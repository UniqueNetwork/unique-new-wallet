import axios, { defaultParams } from './axios';

const get = <T = any>(url: string, params = { ...defaultParams }) => axios.get<T>(url, params);

export default get;
