import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useCollectionCreate = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.creation);
};
