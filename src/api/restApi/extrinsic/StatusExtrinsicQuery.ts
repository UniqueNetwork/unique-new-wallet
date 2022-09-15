import { QueryKey } from 'react-query';

import { IBaseApi } from '@app/api';
import { ExtrinsicResultResponse } from '@app/types/Api';

import { EndpointQuery } from '../request';

export interface RequestArgs {
  hash: string;
}

export class ExtrinsicStatusQuery extends EndpointQuery<
  ExtrinsicResultResponse,
  RequestArgs
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/extrinsic/status';
  }

  getKey({ hash }: RequestArgs): QueryKey {
    return ['extrinsic', 'status', hash];
  }

  request(api: IBaseApi, { hash }: RequestArgs): Promise<ExtrinsicResultResponse> {
    return api.get<ExtrinsicResultResponse>(`${this.baseUrl}?hash=${hash}`);
  }
}
