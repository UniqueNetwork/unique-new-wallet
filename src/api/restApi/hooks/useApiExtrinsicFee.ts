import { useEffect, useState } from 'react';

import { useApi } from '@app/hooks';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

import { EndpointMutation } from '../request';
import { useApiMutation } from './useApiMutation';
import { ExtrinsicApiService } from '../extrinsic';

export const useApiExtrinsicFee = <
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >,
>(
  endpoint: ConcreteEndpointMutation,
  defaultPayload?: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
) => {
  const [fee, setFee] = useState<string>();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (defaultPayload) {
      setPayload(defaultPayload);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

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
    setError(null);
    setIsError(false);
    setIsLoading(true);

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

      setFee([fee.amount.replace(/([0]+)$/, ''), fee.unit].join(' '));
    } catch (e) {
      setIsError(true);
      setError(e as Error);
    } finally {
      setPayload(null);
      setIsLoading(false);
    }
  };

  return {
    fee,
    getFee,
    isLoading,
    isError,
    error,
  };
};
