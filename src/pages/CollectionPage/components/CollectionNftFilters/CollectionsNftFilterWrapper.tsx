import { ReactNode, useCallback, useState } from 'react';

import {
  ListNftsFilterType,
  nftListFilterContext,
} from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { Direction } from '@app/api/graphQL/types';

type CollectionFilterType = {
  children: ReactNode;
};

const DEFAULT_PAGE = 0;

export const CollectionsNftFilterWrapper = ({ children }: CollectionFilterType) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE);
  const [direction, setDirection] = useState<Direction>('desc');
  const [type, setType] = useState<ListNftsFilterType>('all');

  const handleChangeDirection = useCallback((direction: Direction) => {
    setDirection(direction);
    setPage(DEFAULT_PAGE);
  }, []);

  const handleChangeSearch = useCallback((search: string) => {
    setSearch(search);
    setPage(DEFAULT_PAGE);
  }, []);

  return (
    <nftListFilterContext.Provider
      value={{
        type,
        direction,
        page,
        search,
        pageSize,
        onChangeDirection: handleChangeDirection,
        onChangeSearch: handleChangeSearch,
        onChangeType: setType,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
      }}
    >
      {children}
    </nftListFilterContext.Provider>
  );
};
