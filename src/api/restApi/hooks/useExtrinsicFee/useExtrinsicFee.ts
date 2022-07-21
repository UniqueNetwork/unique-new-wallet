import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import { useApi } from '@app/hooks';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

import { EndpointMutation } from '../../request';
import { useApiMutation } from '../useApiMutation';
import { ExtrinsicApiService } from '../../extrinsic';
import { extrinsicFeeReducer } from './extrinsicFeeReducer';
import { UNKNOWN_ERROR_MSG } from '../constants';

export const useExtrinsicFee = <
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >,
>(
  endpoint: ConcreteEndpointMutation,
  defaultPayload?: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
) => {
  const [payload, setPayload] = useState<Omit<
    Parameters<ConcreteEndpointMutation['request']>[0],
    'api'
  > | null>();

  const { api } = useApi();

  const { mutateAsync: obtainExtrinsic } = useApiMutation({
    endpoint,
  });
  const { mutateAsync: obtainFee } = useApiMutation({
    endpoint: ExtrinsicApiService.calculateFee,
  });

  const [extrinsicFeeState, setExtrinsicFeeState] = useReducer(extrinsicFeeReducer, {
    fee: '',
    feeFormatted: undefined,
    error: undefined,
    isError: false,
    isLoading: false,
  });

  const { error, fee, feeFormatted, isError, isLoading } = extrinsicFeeState;

  useEffect(() => {
    if (defaultPayload) {
      setPayload(defaultPayload);
    }
  }, []);

  useEffect(() => {
    if (payload) {
      const execute = () => getFeeAsync(payload);

      execute();
    }
  }, [payload]);

  const getFee = (
    payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
  ) => {
    setPayload(payload);
  };

  const getFeeAsync = async (
    payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
  ) => {
    setExtrinsicFeeState({ type: 'loading' });

    try {
      if (!api) {
        throw new Error('Api is not found');
      }

      const extrinsic: UnsignedTxPayloadResponse = await obtainExtrinsic({
        api,
        ...payload,
      });
      if (!extrinsic) {
        throw new Error('Getting extrinsic error');
      }

      const fee = await obtainFee({ api, extrinsic });
      if (!fee) {
        throw new Error('Fee is not define');
      }

      setExtrinsicFeeState({
        type: 'success',
        payload: {
          fee: fee.amount,
          feeFormatted: [Number(fee.amount).toFixed(4), fee.unit].join(' '),
        },
      });
    } catch (e) {
      let error: Error;

      if (axios.isAxiosError(e)) {
        error = e?.response?.data.error;
      } else if (e instanceof Error) {
        error = e;
      } else {
        error = new Error();
      }

      error.message = error.message || UNKNOWN_ERROR_MSG;

      setExtrinsicFeeState({ type: 'error', payload: { error, fee } });
    }
  };

  return {
    fee,
    feeFormatted,
    feeError: error,
    isFeeError: isError ?? false,
    isFeeLoading: isLoading ?? false,
    getFee,
  };
};
