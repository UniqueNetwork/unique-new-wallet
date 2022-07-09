import { useAccountBalanceService } from '@app/api';

export const useBalanceInsufficient = (address: string | undefined, fee: string) => {
  const { data } = useAccountBalanceService(address);
  const isBalanceInsufficient = +(data?.availableBalance.amount || 0) < +fee;

  return { isBalanceInsufficient };
};
