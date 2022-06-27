import { QueryClient } from 'react-query';

import { EndpointMutation, IBaseApi } from '@app/api';
import { CollectionCreateResponse } from '@app/types';

export type BalanceTransferRequestDTO = {
  address: string;
  destination: string;
  amount: number;
};

interface Payload<TBody> {
  api: IBaseApi;
  body: TBody;
}

export class AccountBalanceTransferMutation extends EndpointMutation<
  any,
  Payload<BalanceTransferRequestDTO>
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/balance';

    this.request = this.request.bind(this);
  }

  async request(payload: Payload<BalanceTransferRequestDTO>): Promise<any> {
    return payload.api.post<any, BalanceTransferRequestDTO>(
      `${this.baseUrl}`,
      payload.body,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: CollectionCreateResponse,
    payload: Payload<BalanceTransferRequestDTO>,
  ) {
    // TODO - add notification here
    // invalidate category query here
  }
}
