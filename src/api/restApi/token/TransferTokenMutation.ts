import { EndpointMutation } from '@app/api/restApi/request';
import { TransferTokenBody, UnsignedTxPayloadResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

export type TransferTokenMutationPayload = {
  api: IBaseApi;
  body: TransferTokenBody;
};

export class TransferTokenMutation extends EndpointMutation<
  UnsignedTxPayloadResponse,
  TransferTokenMutationPayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/token/transfer';

    this.request = this.request.bind(this);
  }

  request(
    payload: TransferTokenMutationPayload,
    signal: AbortSignal | undefined,
  ): Promise<UnsignedTxPayloadResponse> {
    return payload.api.patch<UnsignedTxPayloadResponse, TransferTokenBody>(
      this.baseUrl,
      payload.body,
    );
  }
}
