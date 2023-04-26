import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useCollectionRemoveSponsorship = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.removeSponsorship);
};
