import { IBaseApi } from '@app/api';
import { Balance } from '@app/types';
import { EndpointMutation } from '@app/api/restApi/request';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

export type CalculateFeePayload = {
  api: IBaseApi;
  extrinsic: UnsignedTxPayloadResponse;
};

export class CalculateFeeMutation extends EndpointMutation<Balance, CalculateFeePayload> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/extrinsic/calculate-fee';

    this.request = this.request.bind(this);
  }

  async request(payload: CalculateFeePayload): Promise<Balance> {
    return payload.api.post<Balance, UnsignedTxPayloadResponse>(
      `${this.baseUrl}`,
      payload.extrinsic,
    );
  }
}
