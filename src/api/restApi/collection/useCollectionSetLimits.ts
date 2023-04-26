import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useCollectionSetLimits = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setLimits);
};
