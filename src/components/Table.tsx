import React, { FC } from 'react';
import styled from 'styled-components';
import {
  SortQuery,
  Table as UITable,
  TableColumnProps,
  TableProps,
  Loader,
} from '@unique-nft/ui-kit';

import { DeviceSize, useDeviceSize } from '@app/hooks';

import MobileTable from './MobileTable/MobileTable';

interface UITableProps {
  columns: TableColumnProps[];
  columnPadding?: TableProps['columnPadding'];
  data?: any[];
  loading?: boolean;
  noDataMessage?: string | null;
  onSort?(sorting: SortQuery): void;
}

export const Table: FC<UITableProps> = ({
  columns,
  columnPadding,
  data,
  loading,
  noDataMessage,
  onSort,
}) => {
  const deviceSize = useDeviceSize();

  return (
    <TableWrapper>
      {deviceSize > DeviceSize.md ? (
        <>
          <UITable
            noDataMessage={noDataMessage}
            columns={columns}
            columnPadding={columnPadding}
            data={data || []}
            onSort={onSort}
          />
          {loading && <Loader isFullPage={true} size="middle" />}
        </>
      ) : (
        <MobileTable columns={columns} data={!loading ? data : []} loading={loading} />
      )}
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  position: relative;
`;
