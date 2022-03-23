import axios, { defaultParams } from './axios';

const put = (url: string, body: Record<string, any>, params = { ...defaultParams }) => axios.put(url, body, params);

export default put;
