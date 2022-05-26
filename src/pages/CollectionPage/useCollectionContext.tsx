import { useContext } from 'react';

import { collectionContext } from '@app/pages/CollectionPage/context';

export const useCollectionContext = () => useContext(collectionContext);
