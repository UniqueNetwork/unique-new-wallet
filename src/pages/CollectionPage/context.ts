import { createContext } from 'react';

import { QLCollectionResponse } from '@app/api/graphQL/collections/collections';

export const collectionContext = createContext<QLCollectionResponse | null>(null);
