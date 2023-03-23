import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import {
  Loader,
  SortQuery,
  Table as UITable,
  TableColumnProps,
  TableProps,
} from '@unique-nft/ui-kit';

import { DeviceSize, useDeviceSize } from '@app/hooks';

import MobileTable from './MobileTable/MobileTable';

interface UITableProps {
  columns: TableColumnProps[];
  columnPadding?: TableProps['columnPadding'];
  data?: any[];
  desktopCaption?: ReactNode;
  loading?: boolean;
  mobileCaption?: ReactNode;
  noDataMessage?: string | null;
  noDataComponent?: ReactNode;
  onSort?(sorting: SortQuery): void;
}

const TableCaption = styled.div`
  margin-bottom: calc(var(--prop-gap) * 1.5);
`;

export const Table: FC<UITableProps> = ({
  columns,
  columnPadding,
  desktopCaption,
  data,
  loading,
  mobileCaption,
  noDataMessage,
  noDataComponent,
  onSort,
}) => {
  const deviceSize = useDeviceSize();

  return (
    <TableWrapper>
      {deviceSize > DeviceSize.md ? (
        <>
          {desktopCaption && (
            <TableCaption className="table-caption">{desktopCaption}</TableCaption>
          )}
          <UITable
            columns={columns}
            columnPadding={columnPadding}
            data={data || []}
            noDataMessage={noDataMessage}
            onSort={onSort}
          />
          {loading && <Loader isFullPage={true} size="middle" />}
        </>
      ) : (
        <>
          {mobileCaption && (
            <TableCaption className="table-caption">{mobileCaption}</TableCaption>
          )}
          <MobileTable
            columns={columns}
            data={!loading ? data : []}
            loading={loading}
            noDataComponent={noDataComponent}
          />
        </>
      )}
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  position: relative;
`;
