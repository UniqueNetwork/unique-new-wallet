import { useEffect, useState } from 'react';

import { useApi } from './useApi';
import { NFTCollection } from '../api/chainApi/unique/types';

export const useCollections = () => {
  const { api } = useApi();
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    setIsFetching(true);
    void api?.collection?.getFeaturedCollections().then((collections) => {
      setCollections(collections);
      setIsFetching(false);
    });
  }, [api]);

  return {
    collections,
    isFetching,
  };
};
