import { useApiMutation } from '@app/api';
import { useApi } from '@app/hooks';

import { AccountApiService } from '../AccountApiService';
import { BalanceTransferRequestDTO } from '../mutations';

export const useBalanceTransfer = () => {
  const { api } = useApi();

  const transferMutation = useApiMutation({
    endpoint: AccountApiService.balanceTransfer,
  });

  const transfer = async (transferDTO: BalanceTransferRequestDTO) => {
    if (!api) {
      // TODO - notify user
      return;
    }

    return transferMutation.mutateAsync({
      api,
      body: transferDTO,
    });
  };

  return {
    transfer,
  };
};
