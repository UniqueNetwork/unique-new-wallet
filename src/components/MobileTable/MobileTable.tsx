import React, { FC } from 'react';
import styled from 'styled-components';
import { Loader, TableColumnProps, TableRowProps, Text } from '@unique-nft/ui-kit';

import { getDeepValue } from '@app/utils';
import { NoItems } from '@app/components';

interface MobileTableProps {
  className?: string;
  columns?: TableColumnProps[];
  data?: TableRowProps[];
  loading?: boolean;
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

const MobileTable: FC<MobileTableProps> = ({ columns, data, loading }) => {
  let children = <Loader isFullPage={true} size="middle" />;

  if (!loading && data?.length === 0) {
    children = <NoItemsStyled iconName="no-accounts" iconSize={40} />;
  } else if (!loading) {
    children = (
      <>
        {data?.map((item, rowIdx) => (
          <MobileTableRow className="mobile-table-row" key={rowIdx}>
            {columns?.map((column, colIdx) => (
              <MobileTableCell
                className="mobile-table-cell"
                key={`column-${column.field || colIdx}`}
              >
                {typeof column?.title === 'object' ? (
                  column.title
                ) : (
                  <Text color="grey-500">{column?.title}</Text>
                )}
                {column.render?.(getDeepValue(item, column.field), item, {
                  columnIndex: colIdx,
                  rowIndex: 0,
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
