import React, { FC } from 'react';
import styled from 'styled-components';
import { Text } from '@unique-nft/ui-kit';
import { TableColumnProps, TableRow } from '@unique-nft/ui-kit/dist/cjs/types';

import Loading from '../Loading';

interface MobileTableProps {
  className?: string;
  columns?: TableColumnProps[];
  data?: TableRow[];
  loading?: boolean;
}

const MobileTable: FC<MobileTableProps> = ({ columns, data, loading }) => {
  let children = <Loading />;

  if (!loading && data?.length === 0)
    children = <Text className={'text_grey'}>No data</Text>;
  else if (!loading) {
    children = (
      <>
        {data?.map((item, index) => (
          <MobileTableRow key={index}>
            {columns?.map((column) => (
              <div key={`column-${column.field || ''}`}>
                {typeof column?.title === 'object' ? (
                  <>{column.title}</>
                ) : (
                  <Text color={'grey-500'}>{`${column?.title || ''}`}</Text>
                )}
                {column.render && (
                  <>{column.render(item[column.field as keyof TableRow])}</>
                )}
                {!column.render && (
                  <Text>{item[column.field as keyof TableRow]?.toString() || ''}</Text>
                )}
              </div>
            ))}
          </MobileTableRow>
        ))}
      </>
    );
  }

  return <MobileTableWrapper>{children}</MobileTableWrapper>;
};

const MobileTableWrapper = styled.div`
  margin: var(--prop-gap) 0;
`;

const MobileTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px dashed var(--border-color);
  grid-row-gap: var(--prop-gap);
  padding: var(--prop-gap) 0;
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
`;

export default MobileTable;
