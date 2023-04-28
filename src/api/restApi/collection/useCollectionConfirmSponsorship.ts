import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useCollectionConfirmSponsorship = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.confirmSponsorship);
};
