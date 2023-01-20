import { useExtrinsicMutation } from '@app/api';
import { useApi } from '@app/hooks';

export const useTokenRefungibleTransfer = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.refungible.transferToken);
};
