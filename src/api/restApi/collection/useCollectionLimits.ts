import { useExtrinsicMutation } from '@app/api';
import { useApi } from '@app/hooks';

export const useCollectionLimits = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.setLimits);
};
