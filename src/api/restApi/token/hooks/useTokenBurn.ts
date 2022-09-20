import { useNotifications } from '@unique-nft/ui-kit';

import { BurnTokenBody } from '@app/types/Api';
import { useApi } from '@app/hooks';

import { useApiMutation } from '../../hooks';
import { TokenApiService } from '../TokenApiService';

export const useTokenBurn = () => {
  const { api } = useApi();
  const { error } = useNotifications();
  const { mutateAsync } = useApiMutation({
    endpoint: TokenApiService.burnMutation,
  });

  const tokenBurn = async (payload: BurnTokenBody) => {
    if (!api) {
      error('Api connection error', {
        name: 'Burn NFT',
        size: 32,
        color: 'white',
      });

      return;
    }

    return mutateAsync({
      api,
      payload,
    });
  };

  return {
    tokenBurn,
  };
};
