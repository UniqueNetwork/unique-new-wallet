import { QueryKey } from 'react-query';

import { ChainPropertiesResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

import { EndpointQuery } from '../request';

export class PropertiesQuery extends EndpointQuery<ChainPropertiesResponse> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/chain/properties';
  }

  getKey(): QueryKey {
    return ['chain', 'properties'];
  }

  request(api: IBaseApi): Promise<ChainPropertiesResponse> {
    return api.get<ChainPropertiesResponse>(`${this.baseUrl}`);
  }
}
