import { useState } from 'react';

import { NFTCollection } from '@app/types';

export const useCollections = () => {
  const [collections, setCollection] = useState<NFTCollection[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  return {
    collections,
    isFetching,
  };
};
