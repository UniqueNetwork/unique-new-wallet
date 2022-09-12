import { EndpointMutation } from '@app/api/restApi/request';
import { TransferTokenBody, UnsignedTxPayloadResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

export type TransferTokenMutationPayload = {
  api: IBaseApi;
  payload: TransferTokenBody;
};

export class TransferTokenMutation extends EndpointMutation<
  UnsignedTxPayloadResponse,
  TransferTokenMutationPayload
> {
  baseUrl = '/token-new/transfer';

  constructor() {
    super();

    this.request = this.request.bind(this);
  }

  request(
    { api, payload }: TransferTokenMutationPayload,
    signal: AbortSignal | undefined,
  ): Promise<UnsignedTxPayloadResponse> {
    return api.patch<UnsignedTxPayloadResponse, TransferTokenBody>(this.baseUrl, payload);
  }
}
