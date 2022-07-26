import { useApiMutation } from '@app/api';
import { useApi, useMessage } from '@app/hooks';
import { CreateCollectionFormType } from '@app/pages/CreateCollection/pages';

import { CollectionApiService } from '../CollectionApiService';

export const useCollectionCreate = () => {
  const { api } = useApi();
  const { showError } = useMessage();

  const createMutation = useApiMutation({
    endpoint: CollectionApiService.collectionCreateMutation,
  });

  const createCollection = async (collection: CreateCollectionFormType) => {
    if (!api) {
      showError({ name: 'Create collection api not exists', text: 'Create collection' });
      return;
    }

    return createMutation.mutateAsync({
      api,
      collection,
    });
  };

  return {
    createCollection,
  };
};
