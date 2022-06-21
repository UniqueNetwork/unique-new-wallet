import { QueryClient } from 'react-query';

import { EndpointMutation } from '@app/api/restApi/request';
import { NftTokenDTO, TokenCreateResponse } from '@app/types';
import { IBaseApi } from '@app/api';

export type TokenCreatePayload = {
  api: IBaseApi;
  token: NftTokenDTO;
};

export class TokenCreateMutation extends EndpointMutation<
  TokenCreateResponse,
  TokenCreatePayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/collection';

    this.request = this.request.bind(this);
  }

  async request(payload: TokenCreatePayload): Promise<TokenCreateResponse> {
    return payload.api.post<TokenCreateResponse, NftTokenDTO>(
      `${this.baseUrl}`,
      payload.token,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: TokenCreateResponse,
    payload: TokenCreatePayload,
  ) {
    // TODO - add notification here
    // invalidate category query here
  }
}
