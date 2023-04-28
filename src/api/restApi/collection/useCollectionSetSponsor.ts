import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useCollectionSetSponsor = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setSponsorship);
};
