import { createContext, useContext } from 'react';

import { TOrderBy } from '@app/api';

type TCollectionsFilter = {
  order: TOrderBy;
  page: number;
  search: string;
  onChangeOrder(order: TOrderBy): void;
  onChangePagination(pagination: number): void;
  onChangeSearch(text: string): void;
};

export const myCollectionsContext = createContext<TCollectionsFilter | null>(null);

export const useMyCollectionsContext = () => {
  const context = useContext(myCollectionsContext);

  if (!context) {
    throw new Error('Collections context value was not provided');
  }

  return context;
};
