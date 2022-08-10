import React, { FC } from 'react';
import styled from 'styled-components';
import { Text, TableColumnProps, TableRowProps } from '@unique-nft/ui-kit';

import Loading from '../Loading';

interface MobileTableProps {
  className?: string;
  columns?: TableColumnProps[];
  data?: TableRowProps[];
  loading?: boolean;
}

export const getDeepValue = <T extends Record<string, any>>(object: T, path: string) => {
  return path
    .split(/[.[\]'"]/)
    .filter((p) => p)
    .reduce((o, p) => {
      return o ? o[p] : undefined;
    }, object);
};

const MobileTable: FC<MobileTableProps> = ({ columns, data, loading }) => {
  let children = <Loading />;

  if (!loading && data?.length === 0) {
    children = <Text className="text_grey">No data</Text>;
  } else if (!loading) {
    children = (
      <>
        {data?.map((item, index) => (
          <MobileTableRow key={index}>
            {columns?.map((column, index) => (
              <div key={`column-${column.field || index}`}>
                {typeof column?.title === 'object' ? (
                  column.title
                ) : (
                  <Text color="grey-500">{column?.title}</Text>
                )}
                {(column.render as any)?.(getDeepValue(item, column.field), item) ||
                  getDeepValue(item, column.field)}
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
  gap: var(--prop-gap) calc(var(--prop-gap) / 2);
  padding: var(--prop-gap) 0;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
`;

export default MobileTable;
