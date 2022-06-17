import { useApiMutation } from '@app/api';
import { NftCollectionDTO } from '@app/types';
import { useApi } from '@app/hooks';

import { CollectionApiService } from '../CollectionApiService';

export const useCollectionCreate = () => {
  const { api } = useApi();

  const createMutation = useApiMutation({
    endpoint: CollectionApiService.collectionCreateMutation,
  });

  const createCollection = async (collection: NftCollectionDTO) => {
    if (!api) {
      // TODO - notify user
      return;
    }

    const response = await createMutation.mutateAsync({
      api,
      collection,
    });

    console.log('response', response);

    return response;
  };

  return {
    createCollection,
  };
};
