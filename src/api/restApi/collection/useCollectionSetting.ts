import { useExtrinsicMutation } from '@app/api';
import { useApi } from '@app/hooks';

export const useCollectionSponsorship = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setSponsorship);
};

export const useCollectionLimits = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setLimits);
};

export const useCollectionPermissions = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setPermissions);
};
