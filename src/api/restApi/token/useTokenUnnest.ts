import { useExtrinsicMutation } from '@app/api';
import { useApi } from '@app/hooks';

export const useTokenUnnest = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.tokens.unnest);
};
