import { BurnTokenBody } from '@app/types/Api';
import { useApi } from '@app/hooks';

import { useApiMutation } from '../../hooks';
import { TokenApiService } from '../TokenApiService';

export const useTokenBurn = () => {
  const { api } = useApi();
  const { mutateAsync } = useApiMutation({
    endpoint: TokenApiService.burnMutation,
  });

  const tokenBurn = async (body: BurnTokenBody) => {
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
    tokenBurn,
  };
};
