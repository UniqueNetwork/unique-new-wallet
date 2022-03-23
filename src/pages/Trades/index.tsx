import React, { FC, useCallback, useMemo, useState } from 'react';
import { Text, Pagination } from '@unique-nft/ui-kit';
import { SortQuery, TableColumnProps } from '@unique-nft/ui-kit/dist/cjs/types';

import { useTrades } from '../../api/restApi/trades/trades';
import { shortcutText } from '../../utils/textUtils';
import styled from 'styled-components';
import { Table } from '../../components/Table';
import { PagePaper } from '../../components/PagePaper/PagePaper';

const pageSize = 20;

const AddressComponent = ({ text }: { text: string }) => {
  const shortCut = useMemo(() => (shortcutText(text)), [text]);
  return <Text>{shortCut}</Text>;
};

const tradesColumns: TableColumnProps[] = [
  {
    title: 'Buyer',
    width: '30%',
    render: (data: string) => <AddressComponent text={data} />,
    field: 'buyer'
  },
  {
    title: 'Seller',
    width: '30%',
    render: (data: string) => <AddressComponent text={data} />,
    field: 'seller'
  },
  {
    title: 'Date',
    width: '10%',
    field: 'tradeDate'
  },
  {
    title: 'Collection',
    width: '10%',
    isSortable: true,
    field: 'collectionId'
  },
  {
    title: 'Token',
    width: '10%',
    isSortable: true,
    field: 'tokenId'
  },
  {
    title: 'Price',
    width: '10%',
    isSortable: true,
    field: 'price'
  }
];

export const TradesPage: FC = () => {
  const [page, setPage] = useState<number>(0);
  const [sortString, setSortString] = useState<string>('');

  const { trades, tradesCount, fetchMore } = useTrades({ pageSize, page: page + 1 });

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
    fetchMore({ page: newPage + 1, pageSize, sortString });
  }, [fetchMore, sortString]);

  const onSortChange = useCallback((newSort: SortQuery) => {
    let sortString = '';
    switch (newSort.mode) {
      case 0:
        sortString = 'asc';
        break;
      case 1:
        sortString = 'desc';
        break;
      case 2:
      default:
        sortString = '';
        break;
    }
    if (sortString?.length) sortString += `(${newSort.field})`;
    setSortString(sortString);
    fetchMore({ page: 1, pageSize, sortString });
  }, [fetchMore, setSortString]);

  return (<PagePaper>
    <TradesPageWrapper>
      <Table
        onSort={onSortChange}
        data={trades || []}
        columns={tradesColumns}
      />
      <Pagination
        size={tradesCount}
        current={page}
        perPage={pageSize}
        onPageChange={onPageChange}
        withIcons
      />
    </TradesPageWrapper>
  </PagePaper>);
};

const TradesPageWrapper = styled.div`
  width: 100%
`;
