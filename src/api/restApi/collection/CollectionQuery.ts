import { QueryKey } from 'react-query';

import { CollectionInfoResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

import { EndpointQuery } from '../request';

interface RequestArgs {
  collectionId: number;
}

export class CollectionQuery extends EndpointQuery<CollectionInfoResponse, RequestArgs> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/collection';
  }

  getKey({ collectionId }: RequestArgs): QueryKey {
    return ['collection', collectionId];
  }

  request(api: IBaseApi, { collectionId }: RequestArgs): Promise<CollectionInfoResponse> {
    return api.get<CollectionInfoResponse>(
      `${this.baseUrl}?collectionId=${collectionId}`,
    );
  }
}
