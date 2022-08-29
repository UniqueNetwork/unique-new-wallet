import { createContext, useContext } from 'react';

import { Direction } from '@app/api/graphQL/types';

export type ListNftsFilterType = 'all' | 'owned' | 'disowned';

type TListFilter = {
  direction: Direction;
  search: string;
  type: ListNftsFilterType;
  page: number;
  onChangeDirection(direction: Direction): void;
  onChangeSearch(value: string): void;
  onChangeType(type: ListNftsFilterType): void;
  onChangePagination(pagination: number): void;
};

export const nftListFilterContext = createContext<TListFilter | null>(null);

export const useNftFilterContext = () => {
  const context = useContext(nftListFilterContext);
  if (!context) {
    throw new Error('NTFs filter context value was not provided');
  }
  return context;
};
