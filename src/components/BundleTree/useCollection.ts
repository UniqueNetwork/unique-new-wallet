import { useCollectionQuery } from '@app/api';

export const useCollection = (collectionId: number | undefined) => {
  const { data, isLoading } = useCollectionQuery(collectionId);

  return {
    collection: data,
    isCollectionLoading: isLoading,
  };
};
