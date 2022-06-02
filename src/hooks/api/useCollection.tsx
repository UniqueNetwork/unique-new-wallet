import { useQuery } from 'react-query';

import { getCollectionId } from '@app/api/restApi/collection';
import { useApi } from '@app/hooks';

export const COLLECTION_KEY = (collectionId: string) => ['collection', collectionId];

export const useGetCollection = (collectionId: string) => {
  const { api } = useApi();

  return useQuery(COLLECTION_KEY(collectionId), async () => {
    const { data } = await getCollectionId(api!, collectionId);

    return data;
  });
};
