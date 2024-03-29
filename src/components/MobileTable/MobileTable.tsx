import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { getDeepValue } from '@app/utils';
import { Loader, Typography, TableRowProps, TableColumnProps } from '@app/components';

import { NoItems } from '../NoItems';

interface MobileTableProps {
  className?: string;
  columns?: TableColumnProps[];
  data?: TableRowProps[];
  loading?: boolean;
  noDataComponent?: ReactNode;
}

const MobileTableWrapper = styled.div``;

const MobileTableRow = styled.div`
  margin-bottom: var(--prop-gap);

  &:not(:last-child) {
    border-bottom: 1px dashed var(--color-grey-300);
  }
`;

const MobileTableCell = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: var(--prop-gap);
`;

const NoItemsStyled = styled(NoItems)`
  padding-top: 80px;
`;

const MobileTable: FC<MobileTableProps> = ({
  columns,
  data,
  loading,
  noDataComponent,
}) => {
  let children: ReactNode = <Loader isFullPage={true} size="middle" />;

  if (!loading && data?.length === 0) {
    children = noDataComponent || <NoItemsStyled iconName="no-accounts" iconSize={40} />;
  } else if (!loading) {
    children = (
      <>
        {data?.map((item, rowIndex) => (
          <MobileTableRow className="mobile-table-row" key={rowIndex}>
            {columns?.map((column, colIdx) => (
              <MobileTableCell
                className="mobile-table-cell"
                key={`column-${column.field || colIdx}`}
              >
                {typeof column?.title === 'object' ? (
                  column.title
                ) : (
                  <Typography color="grey-500">{column?.title}</Typography>
                )}
                {column.render?.(getDeepValue(item, column.field), item, {
                  columnIndex: colIdx,
                  rowIndex,
                }) || getDeepValue(item, column.field)}
              </MobileTableCell>
            ))}
          </MobileTableRow>
        ))}
      </>
    );
  }

  return <MobileTableWrapper className="mobile-table">{children}</MobileTableWrapper>;
};

export default MobileTable;
