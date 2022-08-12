import { EndpointMutation } from '@app/api/restApi/request';
import { BurnTokenBody, UnsignedTxPayloadResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

export type BurnTokenMutationPayload = {
  api: IBaseApi;
  body: BurnTokenBody;
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
    payload: BurnTokenMutationPayload,
    signal: AbortSignal | undefined,
  ): Promise<UnsignedTxPayloadResponse> {
    return payload.api.delete<UnsignedTxPayloadResponse, BurnTokenBody>(
      this.baseUrl,
      payload.body,
    );
  }
}
