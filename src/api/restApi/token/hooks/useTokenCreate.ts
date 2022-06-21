import { useApiMutation } from '@app/api';
import { NftTokenDTO } from '@app/types';
import { useApi, useMessage} from '@app/hooks';

import { TokenApiService } from '../TokenApiService';

export const useTokenCreate = () => {
  const { api } = useApi();
  const { showError } = useMessage();

  const createMutation = useApiMutation({
    endpoint: TokenApiService.tokenCreateMutation,
  });

  const createToken = async (token: NftTokenDTO) => {
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
