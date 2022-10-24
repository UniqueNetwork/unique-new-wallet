import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useTokenNest = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.tokens.nest);
};
