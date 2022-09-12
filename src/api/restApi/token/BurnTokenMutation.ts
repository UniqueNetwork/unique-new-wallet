import { EndpointMutation } from '@app/api/restApi/request';
import { BurnTokenBody, UnsignedTxPayloadResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

export type BurnTokenMutationPayload = {
  api: IBaseApi;
  payload: BurnTokenBody;
};

export class BurnTokenMutation extends EndpointMutation<
  UnsignedTxPayloadResponse,
  BurnTokenMutationPayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/token-new/';

    this.request = this.request.bind(this);
  }

  request(
    { api, payload }: BurnTokenMutationPayload,
    signal: AbortSignal | undefined,
  ): Promise<UnsignedTxPayloadResponse> {
    return api.delete<UnsignedTxPayloadResponse, BurnTokenBody>(this.baseUrl, payload);
  }
}
