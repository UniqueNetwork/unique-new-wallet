import { useEffect, useState } from 'react';

import { useAccounts, useApi } from '@app/hooks';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

import { useExtrinsicStatus, useExtrinsicSubmit } from '../extrinsic';
import { useApiMutation } from './useApiMutation';
import { EndpointMutation } from '../request';

type SignAndSubmitExtrinsicStatus =
  | 'idle'
  | 'obtaining'
  | 'signing'
  | 'submitting'
  | 'checking'
  | 'success'
  | 'error';

export const useSignAndSubmitExtrinsic = <
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >,
>(
  endpoint: ConcreteEndpointMutation,
) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [txHash, setTxHash] = useState<string | null | undefined>();
  const [status, setStatus] = useState<SignAndSubmitExtrinsicStatus>('idle');
  const [payload, setPayload] = useState<Omit<
    Parameters<ConcreteEndpointMutation['request']>[0],
    'api'
  > | null>();

  const { api } = useApi();
  const { signMessage } = useAccounts();
  const { data } = useExtrinsicStatus(txHash);
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { mutateAsync } = useApiMutation({
    endpoint,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (payload) {
      const execute = () => signAndSubmitExtrinsicAsync(payload);

      execute();
    }
  }, [payload]);

  useEffect(() => {
    if (!data) {
      return;
    }

    const { isCompleted, isError, errorMessage } = data;

    if (isCompleted) {
      setTxHash(null);
      setPayload(null);
      setStatus('success');

      if (isError) {
        setError(new Error(errorMessage));
        setStatus('error');
        setIsError(true);
      }

      setIsLoading(false);
    }
  }, [data]);

  const signAndSubmitExtrinsic = (
    payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
  ) => {
    setPayload(payload);
  };

  const signAndSubmitExtrinsicAsync = async (
    payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
  ) => {
    setError(null);
    setIsError(false);
    setIsLoading(true);

    try {
      setStatus('obtaining');

      const unsignedResult = await mutateAsync({ ...payload, api });
      if (!unsignedResult) {
        throw new Error('Getting extrinsic error');
      }

      const signerPayloadJSON = (unsignedResult as UnsignedTxPayloadResponse)
        .signerPayloadJSON;

      setStatus('signing');

      const signResult = await signMessage(signerPayloadJSON);
      if (!signResult) {
        throw new Error('Signing result is not define');
      }

      setStatus('submitting');

      const submitResult = await submitExtrinsic({
        signerPayloadJSON,
        signature: signResult,
      });
      if (!submitResult) {
        throw new Error('Submit result is not define');
      }

      setStatus('checking');
      setTxHash(submitResult.hash);

      return submitResult.hash;
    } catch (e) {
      setStatus('error');
      setError(e as Error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  return {
    error,
    isError,
    status,
    isLoading,
    signAndSubmitExtrinsic,
  };
};
