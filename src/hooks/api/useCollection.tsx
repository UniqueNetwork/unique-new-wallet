import { useQuery } from 'react-query';

import { getCollectionId } from '@app/api/restApi/collection';

export const COLLECTION_KEY = (collectionId: string) => ['collection', collectionId];

export const useGetCollection = (collectionId: string) => {
  return useQuery(COLLECTION_KEY(collectionId), async () => {
    const { data } = await getCollectionId(collectionId);
    return data;
  });
};
