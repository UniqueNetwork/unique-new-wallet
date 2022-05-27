import { useQuery, useQueryClient, useMutation } from 'react-query';

import { getCollectionId, deleteCollection } from '@app/api/restApi/collection';

export const COLLECTION_KEY = (collectionId: string) => ['collection', collectionId];

export const useGetCollection = (collectionId: string) => {
  return useQuery(COLLECTION_KEY(collectionId), async () => {
    const { data } = await getCollectionId(collectionId);
    return data;
  });
};

export const useDeleteCollection = (collectionId: string, addressAccount: string) => {
  const queryClient = useQueryClient();
  return useMutation(async () => await deleteCollection(collectionId, addressAccount), {
    onSuccess: () =>
      queryClient.removeQueries({ queryKey: COLLECTION_KEY(collectionId) }),
  });
};
