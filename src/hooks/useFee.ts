import { QueryClient } from 'react-query';
import { useState } from 'react';

import { EndpointMutation } from '@app/api/restApi/request';
import { IBaseApi, useApiMutation } from '@app/api';
import { UnsignedExtrinsicDTO } from '@app/types';
import { useApi } from '@app/hooks/useApi';

export type CalculateFeePayload = {
  api: IBaseApi;
  extrinsic: UnsignedExtrinsicDTO;
};

interface Balance {
  amount: string; // todo Balance (raw, amount, formatted, unit)
  unit: string;
}

export class CalculateFeeMutation extends EndpointMutation<Balance, CalculateFeePayload> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/extrinsic/calculate-fee';

    this.request = this.request.bind(this);
  }

  async request(payload: CalculateFeePayload): Promise<Balance> {
    return payload.api.post<Balance, UnsignedExtrinsicDTO>(
      `${this.baseUrl}`,
      payload.extrinsic,
    );
  }
}

export const useFee = (): {
  fee: string;
  calculate: (extrinsic: UnsignedExtrinsicDTO) => void;
} => {
  const { api } = useApi();
  const [fee, setFee] = useState<string>('');

  const feeMutation = useApiMutation({
    endpoint: new CalculateFeeMutation(),
  });

  const calculate = (extrinsic: UnsignedExtrinsicDTO): void => {
    if (!api) {
      return;
    }

    feeMutation
      .mutateAsync({
        api,
        extrinsic,
      })
      .then(({ amount, unit }) => {
        setFee([
          amount.replace(/([0]+)$/, ''),
          unit,
        ].join(' '));
      });
  };

  return {
    fee,
    calculate,
  };
};
