import { useExtrinsicMutation } from '@app/api';
import { useApi } from '@app/hooks';

export const useCollectionPermissions = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setPermissions);
};
