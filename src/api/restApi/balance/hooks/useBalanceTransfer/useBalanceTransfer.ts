import { useEffect, useState } from 'react';

import { Stage } from '@app/types';
import { useAccounts, useApi } from '@app/hooks';
import {
  AccountApiService,
  useApiMutation,
  useExtrinsicStatus,
  useExtrinsicSubmit,
} from '@app/api';

import { BalanceTransferRequestDTO } from '../../mutations';
import { stageObject } from './stages';

export const useBalanceTransfer = () => {
  const [fee, setFee] = useState<string>('');
  const [stage, setStage] = useState<Stage>(stageObject.Default);
  const [txHash, setTxHash] = useState<string | undefined>();

  const { api } = useApi();
  const { signMessage } = useAccounts();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { data: extrinsicStatus } = useExtrinsicStatus(txHash);

  const transferMutation = useApiMutation({
    endpoint: AccountApiService.balanceTransfer,
  });

  const transfer = async (transferDTO: BalanceTransferRequestDTO) => {
    if (!api) {
      setStage(stageObject.ApiError);

      return;
    }

    return transferMutation.mutateAsync({
      api,
      balanceTransfer: transferDTO,
    });
  };

  const signTransferAndSubmit = async (transferDTO: BalanceTransferRequestDTO) => {
    setStage(stageObject.InProgress);

    try {
      const tx = await transfer(transferDTO);
      if (!tx) {
        setStage(stageObject.TransferingError);

        return;
      }

      const signature = await signMessage(tx.signerPayloadJSON);
      if (!signature) {
        setStage(stageObject.SigningError);

        return;
      }

      const submitResult = await submitExtrinsic({
        ...tx,
        signature,
      });

      if (submitResult) {
        setTxHash(submitResult.hash);
      } else {
        setStage(stageObject.SumbittingError);
      }
    } catch (e) {
      console.error(e);

      setStage(stageObject.UnexpectedError);
    }
  };

  const calculateFee = async (transferDTO: BalanceTransferRequestDTO) => {
    try {
      const tx = await transfer(transferDTO);
      if (tx?.fee) {
        setFee(tx?.fee.amount);
      }
    } catch (e) {
      console.error(e);

      setStage(stageObject.CalculatingFeeError);
    }
  };

  useEffect(() => {
    if (extrinsicStatus) {
      const { isCompleted, isError, errorMessage } = extrinsicStatus;
      if (isCompleted) {
        setTxHash('');
        setStage(stageObject.Success);
      }
      if (isError) {
        console.error(errorMessage);

        setTxHash('');
        setStage(stageObject.UnexpectedError);
      }
    }
  }, [extrinsicStatus]);

  return {
    fee,
    stage,
    calculateFee,
    signTransferAndSubmit,
  };
};
