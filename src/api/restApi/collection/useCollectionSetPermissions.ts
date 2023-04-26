import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useCollectionSetPermissions = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setPermissions);
};
