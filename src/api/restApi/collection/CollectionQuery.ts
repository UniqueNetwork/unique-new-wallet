import { QueryKey } from 'react-query';

import { CollectionInfoWithPropertiesDto } from '@app/types/Api';
import { IBaseApi } from '@app/api';

import { EndpointQuery } from '../request';

interface RequestArgs {
  collectionId: number;
}

export class CollectionQuery extends EndpointQuery<
  CollectionInfoWithPropertiesDto,
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
  ): Promise<CollectionInfoWithPropertiesDto> {
    return api.get<CollectionInfoWithPropertiesDto>(
      `${this.baseUrl}?collectionId=${collectionId}`,
    );
  }
}
