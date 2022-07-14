import { useApiMutation } from '@app/api';
import { NftCollectionDTO } from '@app/types';
import { useApi, useMessage } from '@app/hooks';

import { CollectionApiService } from '../CollectionApiService';

export const useCollectionCreate = () => {
  const { api } = useApi();
  const { showError } = useMessage();

  const createMutation = useApiMutation({
    endpoint: CollectionApiService.collectionCreateMutation,
  });

  const createCollection = async (collection: NftCollectionDTO) => {
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
