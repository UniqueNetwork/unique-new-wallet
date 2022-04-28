import { useCallback, useEffect, useState } from 'react';

import { TTransaction } from '@app/api';

import {
  ActionFunction,
  InternalStage,
  SignFunction,
  StageStatus,
  useStagesReturn,
} from '../types/StagesTypes';

export const useStages = <T, P = Record<string, never>>(
  stages: InternalStage<T, P>[],
  actionFunction: ActionFunction<T, P>,
  signFunction: SignFunction,
): useStagesReturn<T> => {
  const [internalStages, setInternalStages] = useState<InternalStage<T, P>[]>(stages);
  const [stagesStatus, setStagesStatus] = useState<StageStatus>(StageStatus.default);
  const [executionError, setExecutionError] = useState<Error | undefined | null>(null);

  useEffect(() => {
    return () => {
      internalStages?.forEach((internalStage) =>
        internalStage?.signer?.onError(new Error("Componen't unmounted")),
      );
    };
  }, [internalStages]);

  const updateStage = useCallback(
    (index: number, newStage: InternalStage<T, P>) => {
      setInternalStages((stages) => {
        const copy = [...stages];
        copy[index] = newStage;
        return copy;
      });
    },
    [setInternalStages],
  );

  const getSignFunction = useCallback(
    (index: number, internalStage: InternalStage<T, P>) => {
      const sign = async (tx: TTransaction): Promise<TTransaction> => {
        updateStage(index, {
          ...internalStage,
          status: StageStatus.awaitingSign,
        });
        const signedTx = await signFunction(tx);
        updateStage(index, {
          ...internalStage,
          status: StageStatus.inProgress,
        });
        return signedTx;
      };
      return sign;
    },
    [updateStage, signFunction],
  );

  const executeStep = useCallback(
    async (stage: InternalStage<T, P>, index: number, txParams: T) => {
      updateStage(index, { ...stage, status: StageStatus.inProgress });
      try {
        // if sign is required by action -> promise wouldn't be resolved until transaction is signed
        // transaction sign could be triggered in the component that uses current stage (you can track it by using stage.signer)
        await actionFunction(stage.action, txParams, {
          sign: getSignFunction(index, stage),
        });
        updateStage(index, { ...stage, status: StageStatus.success });
      } catch (e) {
        updateStage(index, { ...stage, status: StageStatus.error });
        console.error('Execute stage failed', stage, e);
        throw new Error(`Execute stage "${stage.title}" failed`);
      }
    },
    [updateStage, actionFunction, getSignFunction],
  );

  const initiate = useCallback(
    async (params: T) => {
      setStagesStatus(StageStatus.inProgress);
      for (const [index, internalStage] of internalStages.entries()) {
        try {
          await executeStep(internalStage, index, params);
        } catch (e) {
          setStagesStatus(StageStatus.error);
          setExecutionError(new Error(`Stage "${internalStage.title}" failed`));
          return;
        }
      }
      setStagesStatus(StageStatus.success);
    },
    [executeStep, internalStages],
  );

  return {
    // we don't want our components to know or have any way to interact with stage.actions, everything else is fine
    // TODO: consider to split them apart like InternalStages = [{ stage, action }, ...] instead
    stages: internalStages.map((internalStage: InternalStage<T, P>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { action, ...other } = internalStage;
      return {
        ...other,
      };
    }),
    error: executionError,
    status: stagesStatus,
    initiate,
  };
};

export default useStages;
