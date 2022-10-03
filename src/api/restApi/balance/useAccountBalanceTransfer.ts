import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api/restApi/hooks';

export const useAccountBalanceTransfer = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.balance.transfer);
};
