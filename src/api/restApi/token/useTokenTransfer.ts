import { useExtrinsicMutation } from '@app/api';
import { useApi } from '@app/hooks';

export const useTokenTransfer = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.tokens.transfer);
};
