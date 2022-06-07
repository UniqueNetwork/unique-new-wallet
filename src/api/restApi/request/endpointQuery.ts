import { QueryKey } from 'react-query';

import { IBaseApi } from '@app/api';

import { EndpointQueryMeta } from './types';

export abstract class EndpointQuery<ClientModel, RequestParams = void> {
  protected meta: EndpointQueryMeta<ClientModel, RequestParams> = {};

  getMeta(): EndpointQueryMeta<ClientModel, RequestParams> {
    return this.meta;
  }

  abstract getKey(payload?: RequestParams): QueryKey;

  abstract request(
    api: IBaseApi | undefined,
    payload?: RequestParams,
    signal?: AbortSignal,
  ): Promise<ClientModel>;
}
