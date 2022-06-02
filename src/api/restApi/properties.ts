import { IBaseApi } from '@app/api/restApi/base';
import { ChainProperties } from '@app/types/Api';

const BASE_URL = '/chain/properties';

export const getChainProperties = (Api: IBaseApi) =>
  Api.get<ChainProperties>(`${BASE_URL}`);
