import { useEffect, useReducer, useState } from 'react';
import { AxiosError } from 'axios';

import { useAccounts, useApi } from '@app/hooks';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

import { EndpointMutation } from '../../request';
import { useApiMutation } from '../useApiMutation';
import { useExtrinsicStatus, useExtrinsicSubmit } from '../../extrinsic';
import { extrinsicFlowReducer } from './extrinsicFlowReducer';

type SignAndSubmitExtrinsicStatus =
  | 'idle'
  | 'obtaining'
  | 'signing'
  | 'submitting'
  | 'checking'
  | 'success'
  | 'error';

const isAxiosError = (e: unknown): e is AxiosError => {
  return Object.hasOwn(e as AxiosError, 'response');
};

const isCustomError = (e: unknown): e is Error => {
  return Object.hasOwn(e as Error, 'message');
};

export const useExtrinsicFlow = <
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >,
>(
  endpoint: ConcreteEndpointMutation,
) => {
  const [txHash, setTxHash] = useState<string | null | undefined>();
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

  const [extrinsicFlowState, setExtrinsicFlowState] = useReducer(extrinsicFlowReducer, {
    isError: false,
    isLoading: false,
    error: undefined,
    status: 'idle',
  });
  const { isError, isLoading, status, error } = extrinsicFlowState;

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

      if (isError) {
        setExtrinsicFlowState({
          type: 'error',
          payload: {
            error: new Error(errorMessage),
          },
        });
      } else {
        setExtrinsicFlowState({ type: 'success' });
      }
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
    setExtrinsicFlowState({ type: 'startflow' });

    try {
      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'obtaining' } });

      const unsignedResult = await mutateAsync({ ...payload, api });
      if (!unsignedResult) {
        throw new Error('Getting extrinsic error');
      }

      const signerPayloadJSON = (unsignedResult as UnsignedTxPayloadResponse)
        .signerPayloadJSON;

      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'signing' } });

      const signResult = await signMessage(signerPayloadJSON);
      if (!signResult) {
        throw new Error('Signing result is not define');
      }

      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'submitting' } });

      const submitResult = await submitExtrinsic({
        signerPayloadJSON,
        signature: signResult,
      });
      if (!submitResult) {
        throw new Error('Submit result is not define');
      }

      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'checking' } });
      setTxHash(submitResult.hash);

      return submitResult.hash;
    } catch (e) {
      let error: Error | undefined;

      if (isAxiosError(e)) {
        error = e?.response?.data.error;
      } else if (isCustomError(e)) {
        error = e;
      }

      setExtrinsicFlowState({ type: 'error', payload: { error } });
    }
  };

  return {
    error,
    status,
    isError: isError ?? false,
    isLoading: isLoading ?? false,
    signAndSubmitExtrinsic,
  };
};
