import { ReactNode, useCallback, useState } from 'react';

import {
  ListNftsFilterType,
  nftListFilterContext,
} from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { Direction } from '@app/api/graphQL/tokens';

type CollectionFilterType = {
  children: ReactNode;
};

const DEFAULT_PAGE = 0;

export const CollectionsNftFilterWrapper = ({ children }: CollectionFilterType) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGE);
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

  const handleChangeType = useCallback((type: ListNftsFilterType) => {
    setType(type);
  }, []);

  return (
    <nftListFilterContext.Provider
      value={{
        type,
        direction,
        page,
        search,
        onChangeDirection: handleChangeDirection,
        onChangePagination: setPage,
        onChangeSearch: handleChangeSearch,
        onChangeType: handleChangeType,
      }}
    >
      {children}
    </nftListFilterContext.Provider>
  );
};
