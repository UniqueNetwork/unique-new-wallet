import { IBaseApi } from '@app/api';
import { EndpointMutation } from '@app/api/restApi/request';
import { BalanceResponse, UnsignedTxPayloadResponse } from '@app/types/Api';

export type CalculateFeePayload = {
  api: IBaseApi;
  extrinsic: UnsignedTxPayloadResponse;
};

export class CalculateFeeMutation extends EndpointMutation<
  BalanceResponse,
  CalculateFeePayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/extrinsic/calculate-fee';

    this.request = this.request.bind(this);
  }

  async request(payload: CalculateFeePayload): Promise<BalanceResponse> {
    return payload.api.post<BalanceResponse, UnsignedTxPayloadResponse>(
      `${this.baseUrl}`,
      payload.extrinsic,
    );
  }
}
