import { QueryClient } from 'react-query';

import { IBaseApi } from '@app/api';
import { EndpointMutation } from '@app/api/restApi/request';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

export type BalanceTransferRequestDTO = {
  address: string;
  destination: string;
  amount: number;
};

interface BalanceTransferPayload {
  api: IBaseApi;
  payload: BalanceTransferRequestDTO;
}

export class AccountBalanceTransferMutation extends EndpointMutation<
  UnsignedTxPayloadResponse,
  BalanceTransferPayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/balance/transfer';

    this.request = this.request.bind(this);
  }

  async request({ api, payload }: BalanceTransferPayload) {
    return api.post<UnsignedTxPayloadResponse, BalanceTransferRequestDTO>(
      `${this.baseUrl}`,
      payload,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: UnsignedTxPayloadResponse,
    payload: BalanceTransferPayload,
  ) {
    // TODO - add notification here
    // invalidate category query here
  }
}
