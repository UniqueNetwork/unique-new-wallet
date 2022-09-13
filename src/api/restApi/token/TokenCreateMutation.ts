import { QueryClient } from 'react-query';

import { EndpointMutation } from '@app/api/restApi/request';
import { NftTokenDTO } from '@app/types';
import { CreateTokenNewDto, UnsignedTxPayloadResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

export type TokenCreatePayload = {
  api: IBaseApi;
  token: CreateTokenNewDto;
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

  async request(payload: TokenCreatePayload): Promise<UnsignedTxPayloadResponse> {
    return payload.api.post<UnsignedTxPayloadResponse, CreateTokenNewDto>(
      `${this.baseUrl}`,
      payload.token,
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
