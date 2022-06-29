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
  balanceTransfer: BalanceTransferRequestDTO;
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

  async request(payload: BalanceTransferPayload) {
    return payload.api.post<UnsignedTxPayloadResponse, BalanceTransferRequestDTO>(
      `${this.baseUrl}`,
      payload.balanceTransfer,
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
