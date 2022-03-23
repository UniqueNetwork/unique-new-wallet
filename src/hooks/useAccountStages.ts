import { useCallback } from 'react';
import { useAccounts } from './useAccounts';
import useStages from './useStages';
import { TTransaction } from '../api/chainApi/types';
import { InternalStage, useStagesReturn } from '../types/StagesTypes';

export type AccountStage<T> = InternalStage<T>;

const useAccountStages = <T>(
  stages: InternalStage<T>[],
  accountAddress: string
): useStagesReturn<T> => {
  const { accounts, signTx } = useAccounts();

  const action = useCallback(async (stageAction, txParams, options) => {
    await stageAction({ txParams, options });
  }, []);

  const sign = useCallback(
    async (tx: TTransaction) => {
      const account = accounts.find(
        (account) => account.address === accountAddress
      );

      if (!account) throw new Error('Unavailable account address');

      return await signTx(tx, account);
    },
    [signTx, accountAddress]
  );

  return useStages<T>(stages, action, sign);
};

export default useAccountStages;
