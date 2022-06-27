import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';

export const useCollection = (collectionId: number) => {
  const { data } = useCollectionQuery(collectionId);

  return data;
};
