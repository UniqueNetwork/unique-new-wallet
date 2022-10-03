import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useTokenBurn = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.tokens.burn);
};
