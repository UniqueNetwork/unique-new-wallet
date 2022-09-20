import { useCallback, useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import { useAccounts, useApi } from '@app/hooks';
import { UnsignedTxPayloadResponse } from '@app/types/Api';
import { SubmitExtrinsicResult } from '@app/types';
import { BaseApi, TExtrinsicType, useExtrinsicCacheEntities } from '@app/api';

import { EndpointMutation } from '../../request';
import { UNKNOWN_ERROR_MSG } from '../constants';
import { useApiMutation } from '../useApiMutation';
import { extrinsicFlowReducer } from './extrinsicFlowReducer';
import { useExtrinsicStatus } from '../../extrinsic';

type ExtrinsicRequest<TPayload> = {
  payload: TPayload;
  accountAddress?: string;
};

export const useExtrinsicFlow = <
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    // TODO: fix type
    Parameters<ConcreteEndpointMutation['request']>[0] & any
  >,
>(
  endpoint: ConcreteEndpointMutation,
  type: TExtrinsicType,
) => {
  const { setPayloadEntity } = useExtrinsicCacheEntities();
  const [txHash, setTxHash] = useState<string | null | undefined>();
  const [request, setRequest] = useState<ExtrinsicRequest<
    Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>
  > | null>();

  const { currentChain } = useApi();

  const { signMessage } = useAccounts();
  const { data } = useExtrinsicStatus(txHash);
  const { mutateAsync } = useApiMutation({
    endpoint,
  });

  const [extrinsicFlowState, setExtrinsicFlowState] = useReducer(extrinsicFlowReducer, {
    isError: false,
    isLoading: false,
    error: undefined,
    status: 'idle',
    parsed: undefined,
  });
  const { isError, isLoading, status, error, parsed } = extrinsicFlowState;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (request) {
      const execute = () =>
        signAndSubmitExtrinsicAsync(request.payload, request.accountAddress);

      execute();
    }
  }, [request]);

  useEffect(() => {
    if (!data) {
      return;
    }

    const { isCompleted, isError, errorMessage, parsed } = data;

    if (isCompleted) {
      if (isError) {
        setExtrinsicFlowState({
          type: 'error',
          payload: {
            error: new Error(errorMessage ?? UNKNOWN_ERROR_MSG),
          },
        });
      } else {
        setPayloadEntity({ type, parsed, entityData: request?.payload.payload });
        setExtrinsicFlowState({ type: 'success', payload: { parsed } });
      }
      setTxHash(null);
      setRequest(null);
    }
  }, [data]);

  const signAndSubmitExtrinsic = useCallback(
    (
      payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
      accountAddress?: string,
    ) => {
      setRequest({
        payload,
        accountAddress,
      });
    },
    [],
  );

  const signAndSubmitExtrinsicAsync = async (
    payload: Omit<Parameters<ConcreteEndpointMutation['request']>[0], 'api'>,
    accountAddress?: string,
  ) => {
    const api = new BaseApi(currentChain.apiEndpoint);

    api.instance.defaults.params = {
      use: 'Build',
    };

    setExtrinsicFlowState({ type: 'startflow' });

    try {
      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'obtaining' } });
      const unsignedResult: UnsignedTxPayloadResponse = await mutateAsync({
        ...payload,
        api,
      });
      if (!unsignedResult) {
        throw new Error('Getting extrinsic error');
      }

      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'signing' } });

      const signResult = await signMessage(unsignedResult, accountAddress);
      if (!signResult) {
        throw new Error('Signing result is not define');
      }

      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'submitting' } });

      api.instance.defaults.params = {
        use: 'SubmitWatch',
      };

      const submitResult: SubmitExtrinsicResult = await mutateAsync({
        payload: {
          signerPayloadJSON: unsignedResult.signerPayloadJSON,
          signature: signResult,
        },
        api,
      });

      setExtrinsicFlowState({ type: 'statusupdate', payload: { status: 'checking' } });
      setTxHash(submitResult.hash);

      return submitResult.hash;
    } catch (e) {
      let error: Error;

      if (axios.isAxiosError(e)) {
        error = e?.response?.data;
      } else if (e instanceof Error) {
        error = e;
      } else {
        error = new Error();
      }

      error.message = error.message || UNKNOWN_ERROR_MSG;

      setExtrinsicFlowState({
        type: 'error',
        payload: { error },
      });
    }
  };

  return {
    flowError: error,
    flowStatus: status,
    flowParsed: parsed,
    isFlowError: isError ?? false,
    isFlowLoading: isLoading ?? false,
    signAndSubmitExtrinsic,
  };
};
