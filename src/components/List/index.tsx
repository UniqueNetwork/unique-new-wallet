import React, { ReactNode } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Button, IPaginationProps, Loader, Pagination, Text } from '@unique-nft/ui-kit';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { NoItems, PagePaper } from '@app/components';

import Item from './Item';

List.Item = Item;

type Position = 'both' | 'bottom' | 'top';

type IPaginationSettings = Pick<
  IPaginationProps,
  'current' | 'size' | 'pageSizes' | 'visible'
> & {
  show?: boolean;
  viewMode: Position | undefined;
};

interface IPanelSettings {
  pagination: IPaginationSettings;
  extraText?: ReactNode;
  viewMode?: Position;
}

export type ListProps<T> = Pick<IPaginationProps, 'onPageChange'> & {
  className?: string;
  dataSource: T[];
  isLoading?: boolean;
  loadMoreHandle?(): void;
  panelSettings: IPanelSettings;
  renderItem?: (item: T, index: number) => ReactNode;
  showMore?: boolean;
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

  &.__empty {
    display: flex;
  }
`;

const ListPanel = styled.div`
  flex: 0 0 auto;

  &[class*='__stackedWith'] {
    padding-left: 0;
    padding-right: 0;
  }

  .unique-pagination-wrapper {
    margin-left: auto;
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

const ItemScope = styled.div`
  box-sizing: border-box;
  position: relative;
  flex: 1 1 auto;
  width: 100%;

  display: grid;
  align-content: baseline;
  gap: calc(var(--prop-gap) * 2);

  @media screen and (min-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  // TODO: feat: page layout breakpoints
  //@media screen and (min-width: 1400px) {
  //  grid-template-columns: repeat(4, 1fr);
  //}

  @media screen and (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const ButtonMoreWrapper = styled.div`
  margin-top: auto;
  padding: calc(var(--prop-gap) * 2) 0;
`;

function List<T>({
  className,
  dataSource,
  isLoading,
  panelSettings,
  renderItem,
  loadMoreHandle,
  showMore,
  onPageChange,
}: ListProps<T>) {
  const deviceSize = useDeviceSize();
  const listItemsKeys: { [index: number]: React.Key } = {};

  const renderInnerItem = (item: T, index: number) => {
    if (!renderItem) {
      return null;
    }

    let key = (item as any).key;

    if (!key) {
      key = `list-item-${index}`;
    }

    listItemsKeys[index] = key;

    return renderItem(item, index);
  };

  let childrenContent = isLoading && <Loader isFullPage size="middle" />;

  if (dataSource.length > 0) {
    const items = dataSource.map((item: T, index: number) =>
      renderInnerItem(item, index),
    );
    childrenContent = (
      <ItemScope className={classNames(className, listClassName)} role="list">
        {items}
      </ItemScope>
    );
  } else if (!isLoading) {
    childrenContent = <NoItems iconName="box" />;
  }

  const paginationContent = panelSettings.pagination.show ? (
    <Pagination
      withIcons
      current={panelSettings.pagination.current}
      pageSizes={panelSettings.pagination.pageSizes}
      size={panelSettings.pagination.size}
      onPageChange={onPageChange}
    />
  ) : null;

  const ResultItemText = (
    <Text>{`${panelSettings.pagination.size} ${
      panelSettings.pagination.size === 1 ? 'result' : 'results'
    }`}</Text>
  );

  return (
    <Wrapper>
      {!!dataSource.length &&
        (panelSettings.viewMode === 'both' || panelSettings.viewMode === 'top') && (
          <ListPanel as={PagePaper.Panel} stacked="bottom">
            <ListExtra>
              {!!dataSource.length && ResultItemText}
              {panelSettings.extraText && panelSettings.extraText}
            </ListExtra>

            {!loadMoreHandle &&
              (panelSettings.pagination.viewMode === 'both' ||
                panelSettings.pagination.viewMode === 'top') &&
              paginationContent}
          </ListPanel>
        )}

      <ListBody className={classNames({ __empty: !dataSource.length })}>
        {childrenContent}

        <ButtonMoreWrapper>
          {showMore && deviceSize <= DeviceSize.md && (
            <Button
              title="Load more"
              iconRight={{ color: 'currentColor', name: 'arrow-down', size: 16 }}
              wide={deviceSize <= DeviceSize.xs}
              onClick={loadMoreHandle}
            />
          )}
        </ButtonMoreWrapper>
      </ListBody>

      {deviceSize >= DeviceSize.lg &&
        !!dataSource.length &&
        (panelSettings.viewMode === 'both' || panelSettings.viewMode === 'bottom') && (
          <ListPanel as={PagePaper.Panel} stacked="top">
            {!!dataSource.length && ResultItemText}

            {(panelSettings.pagination.viewMode === 'both' ||
              panelSettings.pagination.viewMode === 'bottom') &&
              paginationContent}
          </ListPanel>
        )}
    </Wrapper>
  );
}

export default List;
