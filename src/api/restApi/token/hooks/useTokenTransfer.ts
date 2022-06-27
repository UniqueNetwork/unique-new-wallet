import { useApiMutation } from '@app/api';
import { TransferTokenBody } from '@app/types/Api';
import { useApi } from '@app/hooks';

import { TokenApiService } from '../TokenApiService';

export const useTokenTransfer = () => {
  const { api } = useApi();
  const { mutateAsync } = useApiMutation({
    endpoint: TokenApiService.transferMutation,
  });

  const tokenTransfer = async (body: TransferTokenBody) => {
    if (!api) {
      // TODO - notify user
      return;
    }

    return mutateAsync({
      api,
      body,
    });
  };

  return {
    tokenTransfer,
  };
};
