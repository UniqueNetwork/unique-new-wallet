import { QueryKey } from 'react-query';

import { CollectionInfoWithSchemaResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

import { EndpointQuery } from '../request';

interface RequestArgs {
  collectionId: number;
}

export class CollectionQuery extends EndpointQuery<
  CollectionInfoWithSchemaResponse,
  RequestArgs
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/collections';
  }

  getKey({ collectionId }: RequestArgs): QueryKey {
    return ['collection', collectionId];
  }

  request(
    api: IBaseApi,
    { collectionId }: RequestArgs,
  ): Promise<CollectionInfoWithSchemaResponse> {
    return api.get<CollectionInfoWithSchemaResponse>(
      `${this.baseUrl}?collectionId=${collectionId}`,
    );
  }
}
