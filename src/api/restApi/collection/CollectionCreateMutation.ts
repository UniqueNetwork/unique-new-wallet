import { QueryClient } from 'react-query';

import { EndpointMutation } from '@app/api/restApi/request';
import { IBaseApi } from '@app/api';
import { CreateCollectionNewRequest, UnsignedTxPayloadResponse } from '@app/types/Api';

export type CollectionCreatePayload = {
  api: IBaseApi;
  collection: CreateCollectionNewRequest;
};

export class CollectionCreateMutation extends EndpointMutation<
  UnsignedTxPayloadResponse,
  CollectionCreatePayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/collection-new';

    this.request = this.request.bind(this);
  }

  async request(payload: CollectionCreatePayload): Promise<UnsignedTxPayloadResponse> {
    return payload.api.post<UnsignedTxPayloadResponse, CreateCollectionNewRequest>(
      `${this.baseUrl}`,
      payload.collection,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: UnsignedTxPayloadResponse,
    payload: CollectionCreatePayload,
  ) {
    // TODO - add notification here
    // invalidate category query here
  }
}
