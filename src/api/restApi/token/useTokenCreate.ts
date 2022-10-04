import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useTokenCreate = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.tokens.create);
};
