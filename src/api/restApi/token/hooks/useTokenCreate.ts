import { useApiMutation } from '@app/api';
import { useApi, useMessage } from '@app/hooks';
import { CreateTokenNewDto } from '@app/types/Api';

import { TokenApiService } from '../TokenApiService';

export const useTokenCreate = () => {
  const { api } = useApi();
  const { showError } = useMessage();

  const createMutation = useApiMutation({
    endpoint: TokenApiService.tokenCreateMutation,
  });

  const createToken = async (token: CreateTokenNewDto) => {
    if (!api) {
      showError({ name: 'Create token api not exists', text: 'Create token' });
      return;
    }

    return createMutation.mutateAsync({
      api,
      token,
    });
  };

  return {
    createToken,
  };
};
