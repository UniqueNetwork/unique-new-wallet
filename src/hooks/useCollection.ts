import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';

export const useCollection = (collectionId: number) => {
  const collection = useCollectionQuery(collectionId);

  console.log('collection', collection);

  return {
    collectionCover: '',
    name: 'name',
    description: 'description',
    tokenPrefix: 'tokenPrefix',
  };
};
