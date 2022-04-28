import { useMemo } from 'react';

import { useApi } from '../useApi';
import { TTransferFunds } from '../../pages/Accounts/Modals/types';
import useAccountStages, { AccountStage } from '../useAccountStages';
import { InternalStage, StageStatus } from '../../types/StagesTypes';

export const useTransferFundsStages = (accountAddress: string) => {
  const { api } = useApi();
  const minterApi = api?.minter;
  const transferStages: AccountStage<TTransferFunds>[] = useMemo(
    () => [
      {
        title: 'Transfer funds',
        description: '',
        status: StageStatus.default,
        action: (params) =>
          minterApi?.transferBalance(
            params.txParams.sender,
            params.txParams?.recipient || '',
            params.txParams?.amount,
            params.options,
          ),
      },
    ],
    [minterApi],
  ) as InternalStage<TTransferFunds>[];
  const { stages, error, status, initiate } = useAccountStages<TTransferFunds>(
    transferStages,
    accountAddress,
  );

  return {
    stages,
    error,
    status,
    initiate,
  };
};
