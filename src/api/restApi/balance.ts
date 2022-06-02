import { Balance } from '@app/types/Api';
import { IBaseApi } from '@app/api';

const BASE_URL = '/balance';

export const getAccountBalance = (Api: IBaseApi, address: string) =>
  Api.get<Balance>(`${BASE_URL}?address=${address}`);
