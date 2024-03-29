import { ReactNode, useState } from 'react';
import { OperationVariables } from '@apollo/client/core/types';
import styled from 'styled-components';
import classNames from 'classnames';

import { DeviceSize, SizeMap, useDeviceSize } from '@app/hooks';
import { Button, NoItems, PagePaper } from '@app/components';

import { IPaginationProps, Loader, Pagination, Typography } from '..';
import Item from './Item';

List.Item = Item;

type Position = 'both' | 'bottom' | 'top';

type IPaginationSettings = Pick<
  IPaginationProps,
  'current' | 'size' | 'pageSizes' | 'visible' | 'itemTitle' | 'perPage'
> & {
  show?: boolean;
  viewMode: Position | undefined;
  perPageSelector?: boolean;
};

interface IPanelSettings {
  pagination: IPaginationSettings;
  extraText?: ReactNode;
  viewMode?: Position;
}

export type ListProps<T> = Pick<IPaginationProps, 'onPageChange' | 'onPageSizeChange'> & {
  className?: string;
  dataSource: T[];
  fetchMore?(variables?: any): void;
  isLoading?: boolean;
  itemCols: Record<string, number>;
  panelSettings: IPanelSettings;
  renderItem?: (item: T, index: number) => ReactNode;
  visibleItems?: number;
  noItemsIconName?: string;
  noItemsTitle?: ReactNode;
  resultsComponent?: ReactNode;
};

const listClassName = 'unique-list';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;

  .unique-loader {
    z-index: 5;
  }
`;

const ListBody = styled.div`
  flex: 1 1 auto;
  padding-bottom: calc(var(--prop-gap) * 2.5);

  @media screen and (min-width: 1024px) {
    padding-bottom: 0;
  }

  &.__empty {
    display: flex;
  }
`;

const ListPanel = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: stretch !important;
  flex-direction: column;

  &[class*='__stackedWith'] {
    padding-left: 0;
    padding-right: 0;
  }

  &[class*='__stackedWith_top'] {
    .unique-pagination-wrapper .unique-select .select-wrapper .select-dropdown {
      top: unset;
      bottom: calc(100% + 4px);
    }
  }

  .unique-pagination-wrapper {
    flex: 1;
    justify-content: space-between;
  }
`;

const ListExtra = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: calc(var(--prop-gap) * 0.75);
  max-width: 100%;

  .unique-chip {
    overflow: hidden;
    box-sizing: border-box;
    max-width: 100%;
  }
`;

const ItemScope = styled.div<{ cols: Record<string, number>; breakpoint: string }>`
  box-sizing: border-box;
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  display: grid;
  align-content: baseline;
  gap: calc(var(--prop-gap) * 2);
  grid-template-columns: repeat(${(p) => p.cols[p.breakpoint]}, 1fr);
`;

const ButtonMoreWrapper = styled.div`
  margin-top: auto;
  padding-top: calc(var(--prop-gap) * 2);
`;

export function List<T>({
  className,
  dataSource,
  fetchMore,
  isLoading,
  itemCols,
  panelSettings,
  renderItem,
  visibleItems,
  onPageChange,
  onPageSizeChange,
  noItemsIconName = 'box',
  noItemsTitle = 'Nothing found',
  resultsComponent,
}: ListProps<T>) {
  const deviceSize = useDeviceSize();
  const size = SizeMap[deviceSize];

  let childrenContent = isLoading && <Loader isFullPage size="middle" />;

  if (dataSource.length > 0) {
    const items = dataSource.map((item: T, index: number) => renderItem?.(item, index));
    childrenContent = (
      <ItemScope
        breakpoint={size}
        className={classNames(className, listClassName)}
        cols={itemCols}
        role="list"
      >
        {items}
      </ItemScope>
    );
  } else if (!isLoading) {
    childrenContent = <NoItems iconName={noItemsIconName} title={noItemsTitle} />;
  }

  const ResultItemText = resultsComponent || (
    <Typography>{`${panelSettings.pagination.size} ${
      panelSettings.pagination.size === 1 ? 'result' : 'results'
    }`}</Typography>
  );

  const [count, setCount] = useState(2);
  const currentLimit = visibleItems && visibleItems * count;

  const handleMoreButton = () => {
    fetchMore?.({
      variables: {
        offset: 0,
        limit: currentLimit,
      },
      updateQuery: (prev: any, { fetchMoreResult }: OperationVariables) => {
        setCount(count + 1);

        if (!fetchMoreResult) {
          return prev;
        }

        return fetchMoreResult;
      },
    });
  };

  return (
    <Wrapper>
      {(panelSettings.viewMode === 'both' || panelSettings.viewMode === 'top') && (
        <ListPanel as={PagePaper.Panel} stacked="bottom">
          <ListExtra>
            {!panelSettings.pagination.perPageSelector &&
              !!dataSource.length &&
              ResultItemText}
            {panelSettings.extraText}
          </ListExtra>

          {panelSettings.pagination.show &&
            panelSettings.pagination.perPageSelector &&
            !!dataSource.length &&
            !fetchMore &&
            (panelSettings.pagination.viewMode === 'both' ||
              panelSettings.pagination.viewMode === 'top') && (
              <Pagination
                withIcons
                current={panelSettings.pagination.current}
                perPage={panelSettings.pagination.perPage}
                pageSizes={panelSettings.pagination.pageSizes}
                size={panelSettings.pagination.size}
                withPerPageSelector={panelSettings.pagination.perPageSelector}
                itemTitle={panelSettings.pagination.itemTitle}
                visible={5}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            )}
        </ListPanel>
      )}

      <ListBody className={classNames({ __empty: !dataSource.length })}>
        {childrenContent}

        {deviceSize <= DeviceSize.md &&
          dataSource.length < panelSettings.pagination.size && (
            <ButtonMoreWrapper>
              <Button
                title="Load more"
                iconRight={{ color: 'currentColor', name: 'arrow-down', size: 16 }}
                wide={deviceSize <= DeviceSize.xs}
                onClick={handleMoreButton}
              />
            </ButtonMoreWrapper>
          )}
      </ListBody>

      {deviceSize >= DeviceSize.lg &&
        !!dataSource.length &&
        panelSettings.pagination.show &&
        (panelSettings.viewMode === 'both' || panelSettings.viewMode === 'bottom') && (
          <ListPanel as={PagePaper.Panel} stacked="top">
            {(panelSettings.pagination.viewMode === 'both' ||
              panelSettings.pagination.viewMode === 'bottom') && (
              <Pagination
                withIcons
                current={panelSettings.pagination.current}
                perPage={panelSettings.pagination.perPage}
                pageSizes={panelSettings.pagination.pageSizes}
                size={panelSettings.pagination.size}
                withPerPageSelector={panelSettings.pagination.perPageSelector}
                itemTitle={panelSettings.pagination.itemTitle}
                visible={5}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            )}
          </ListPanel>
        )}
    </Wrapper>
  );
}
