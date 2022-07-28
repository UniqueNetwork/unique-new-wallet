import { useContext } from 'react';

import CollectionFormContext from './CollectionFormContext';

export const useCollectionFormContext = () => {
  const context = useContext(CollectionFormContext);

  if (!context) {
    // throw new Error('Collection form context not exist');
  }
  return context;
};
