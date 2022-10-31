import { useAccountBalanceService } from '@app/api';

export const useIsSufficientBalance = (
  address: string | undefined | null,
  ...cost: Array<string | undefined | null>
) => {
  const { data } = useAccountBalanceService(address ?? undefined);

  if (!cost.length) {
    return false;
  }

  const parsedCost = cost.reduce((acc, val) => acc + parseFloat(val ?? ''), 0);

  if (isNaN(parsedCost)) {
    return false;
  }

  return +(data?.availableBalance.amount ?? 0) >= parsedCost;
};

export const useBalanceInsufficient = (address: string | undefined, fee: string) => {
  const { data } = useAccountBalanceService(address);
  const isBalanceInsufficient = +(data?.availableBalance.amount || 0) < +fee;

  return { isBalanceInsufficient };
};
