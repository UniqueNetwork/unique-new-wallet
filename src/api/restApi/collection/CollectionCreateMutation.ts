import { QueryClient } from 'react-query';

import { EndpointMutation } from '@app/api/restApi/request';
import { CollectionCreateResponse, NftCollectionDTO } from '@app/types';
import { IBaseApi } from '@app/api';

export type CollectionCreatePayload = {
  api: IBaseApi;
  collection: NftCollectionDTO;
};

export class CollectionCreateMutation extends EndpointMutation<
  CollectionCreateResponse,
  CollectionCreatePayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/collection';

    this.request = this.request.bind(this);
  }

  async request(payload: CollectionCreatePayload): Promise<CollectionCreateResponse> {
    return payload.api.post<CollectionCreateResponse, NftCollectionDTO>(
      `${this.baseUrl}`,
      payload.collection,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: CollectionCreateResponse,
    payload: CollectionCreatePayload,
  ) {
    // TODO - add notification here
    // invalidate category query here
  }
}
