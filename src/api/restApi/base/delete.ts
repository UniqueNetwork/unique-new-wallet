import axios, { defaultParams } from './axios';

const axiosDelete = (url: string, params = { ...defaultParams }) =>
  axios.delete(url, params);

export default axiosDelete;
