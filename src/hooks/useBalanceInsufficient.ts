import { useAccountBalanceService } from '@app/api';

import { useApi } from './useApi';

export const useIsSufficientBalance = (
  address: string | undefined | null,
  ...cost: Array<string | undefined | null>
) => {
  const { currentChain } = useApi();
  const { data } = useAccountBalanceService(
    address ?? undefined,
    currentChain.apiEndpoint,
  );

  if (!cost.length) {
    return null;
  }

  const parsedCost = cost.reduce((acc, val) => acc + parseFloat(val ?? ''), 0);

  if (isNaN(parsedCost)) {
    return null;
  }

  return +(data?.availableBalance.amount ?? 0) >= parsedCost;
};

export const useBalanceInsufficient = (address: string | undefined, fee: string) => {
  const { data } = useAccountBalanceService(address);
  const isBalanceInsufficient = +(data?.availableBalance.amount || 0) < +fee;

  return { isBalanceInsufficient };
};
