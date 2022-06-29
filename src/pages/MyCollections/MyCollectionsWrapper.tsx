import { ReactNode, useCallback, useState } from 'react';

import { myCollectionsContext } from '@app/pages/MyCollections/context';
import { TOrderBy } from '@app/api';

type TMyCollectionsWrapper = {
  children: ReactNode;
};

export const MyCollectionsWrapper = ({ children }: TMyCollectionsWrapper) => {
  const [order, setOrder] = useState<TOrderBy>({ collection_id: 'desc' });
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const handleChangeOrder = useCallback((order: TOrderBy) => {
    setOrder(order);
    setPage(0);
  }, []);

  const handleChangeSearch = useCallback((searchStr: string) => {
    setSearch(searchStr);
    setPage(0);
  }, []);

  return (
    <myCollectionsContext.Provider
      value={{
        order,
        page,
        search,
        onChangeOrder: handleChangeOrder,
        onChangePagination: setPage,
        onChangeSearch: handleChangeSearch,
      }}
    >
      {children}
    </myCollectionsContext.Provider>
  );
};
