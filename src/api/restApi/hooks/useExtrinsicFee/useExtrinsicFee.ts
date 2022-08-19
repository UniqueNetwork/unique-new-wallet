import { useCallback, useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import { useApi } from '@app/hooks';
import { UnsignedTxPayloadResponse } from '@app/types/Api';
import { truncateDecimalsBalanceSheet } from '@app/utils';
import { BaseApi } from '@app/api';

import { EndpointMutation } from '../../request';
import { useApiMutation } from '../useApiMutation';
import { extrinsicFeeReducer } from './extrinsicFeeReducer';
import { UNKNOWN_ERROR_MSG } from '../constants';

export const useExtrinsicFee = <
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >,
>(
  endpoint: ConcreteEndpointMutation,
) => {
  const [payload, setPayload] = useState<Omit<
    Parameters<ConcreteEndpointMutation['request']>[0],
    'api'
  > | null>(null);

  const { currentChain } = useApi();

  const api = new BaseApi(currentChain.apiEndpoint);

  const { mutateAsync: obtainExtrinsic } = useApiMutation({
    endpoint,
  });

  const [extrinsicFeeState, setExtrinsicFeeState] = useReducer(extrinsicFeeReducer, {
    fee: '',
    feeFormatted: '',
    error: undefined,
    isError: false,
    isLoading: false,
  });

  const { error, fee, feeFormatted, isError, isLoading } = extrinsicFeeState;

  useEffect(() => {
    if (payload) {
      const execute = () => getFeeAsync(payload);

      execute();
    }
  }, [payload]);

  const getFee = useCallback(
    (payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>) => {
      setPayload(payload);
    },
    [],
  );

  const getFeeAsync = async (
    payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
  ) => {
    setExtrinsicFeeState({ type: 'loading' });

    try {
      if (!api) {
        throw new Error('Api is not found');
      }

      api.instance.defaults.params = {
        withFee: true,
      };

      const extrinsic: UnsignedTxPayloadResponse = await obtainExtrinsic({
        api,
        ...payload,
      });

      if (!extrinsic) {
        throw new Error('Getting extrinsic error');
      }

      const { fee } = extrinsic;
      if (!fee) {
        throw new Error('Fee is not define');
      }

      setExtrinsicFeeState({
        type: 'success',
        payload: {
          fee: fee.amount,
          feeFormatted: [truncateDecimalsBalanceSheet(fee.amount), fee.unit].join(' '),
        },
      });
    } catch (e) {
      console.log('ASD', e);
      let error: Error;

      if (axios.isAxiosError(e)) {
        error = e?.response?.data.error;
      } else if (e instanceof Error) {
        error = e;
      } else {
        error = new Error();
      }

      error.message = error.message || UNKNOWN_ERROR_MSG;

      setExtrinsicFeeState({
        type: 'error',
        payload: { error, fee: '', feeFormatted: '' },
      });
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
