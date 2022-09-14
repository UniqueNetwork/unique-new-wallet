import { QueryClient } from 'react-query';

import { EndpointMutation } from '@app/api/restApi/request';
import { CreateTokenNewDto, UnsignedTxPayloadResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

export type TokenCreatePayload = {
  api: IBaseApi;
  payload: CreateTokenNewDto;
};

export class TokenCreateMutation extends EndpointMutation<
  UnsignedTxPayloadResponse,
  TokenCreatePayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/tokens';

    this.request = this.request.bind(this);
  }

  async request({
    api,
    payload,
  }: TokenCreatePayload): Promise<UnsignedTxPayloadResponse> {
    return api.post<UnsignedTxPayloadResponse, CreateTokenNewDto>(
      `${this.baseUrl}`,
      payload,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: UnsignedTxPayloadResponse,
    payload: TokenCreatePayload,
  ) {
    // TODO - add notification here
    // invalidate category query here
  }
}
