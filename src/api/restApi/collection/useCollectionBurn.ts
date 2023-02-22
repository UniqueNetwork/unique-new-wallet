import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useCollectionBurn = () => {
  const { api } = useApi();

  return useExtrinsicMutation(api.collections.destroy);
};
