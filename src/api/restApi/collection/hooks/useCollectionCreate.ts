import { useApiMutation } from '@app/api';
import { useApi, useMessage } from '@app/hooks';
import { CreateCollectionNewRequest } from '@app/types/Api';

import { CollectionApiService } from '../CollectionApiService';

export const useCollectionCreate = () => {
  const { api } = useApi();
  const { showError } = useMessage();

  const createMutation = useApiMutation({
    endpoint: CollectionApiService.collectionCreateMutation,
  });

  const createCollection = async (collection: CreateCollectionNewRequest) => {
    if (!api) {
      showError({ name: 'Create collection api not exists', text: 'Create collection' });
      return;
    }

    return createMutation.mutateAsync({
      api,
      payload: collection,
    });
  };

  return {
    createCollection,
  };
};
