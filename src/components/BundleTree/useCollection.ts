import { useCollectionGetById } from '@app/api';

export const useCollection = (collectionId: number | undefined) => {
  const { data, isLoading } = useCollectionGetById(collectionId);

  return {
    collection: data,
    isCollectionLoading: isLoading,
  };
};
