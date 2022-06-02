import { IBaseApi } from '@app/api/restApi/base';
import { ChainPropertiesResponse } from '@app/types/Api';

const BASE_URL = '/chain/properties';

export const getChainProperties = (Api: IBaseApi) =>
  Api.get<ChainPropertiesResponse>(`${BASE_URL}`);
