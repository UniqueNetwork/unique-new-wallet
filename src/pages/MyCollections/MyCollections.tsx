import { useContext, useEffect, useState, VFC } from 'react';
import { Outlet, useNavigate, useOutlet } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Text } from '@unique-nft/ui-kit';

import { PagePaper, TokenLink } from '@app/components';
import { MyCollectionsWrapper } from '@app/pages/MyCollections/MyCollectionsWrapper';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { MY_COLLECTIONS_ROUTE, ROUTE } from '@app/routes';
import { DeviceSize, useApi, useDeviceSize, useItemsLimit } from '@app/hooks';
import AccountContext from '@app/account/AccountContext';
import { useExtrinsicCacheEntities } from '@app/api';
import { Collection } from '@app/api/graphQL/types';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { useGraphQlCheckInExistCollectionsByAccount } from '@app/api/graphQL/collections/useGraphQlCheckInExistCollectionsByAccount';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import List from '@app/components/List';
import {
  BottomBar,
  BottomBarHeader,
  BottomBarProps,
} from '@app/pages/components/BottomBar';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';

import { TopFilter } from './components';
import { useMyCollectionsContext } from './context';

interface MyCollectionsComponentProps {
  className?: string;
}

export const MyCollectionsComponent: VFC<MyCollectionsComponentProps> = ({
  className,
}) => {
  const { currentChain } = useApi();
  const { selectedAccount } = useContext(AccountContext);
  const deviceSize = useDeviceSize();
  const navigate = useNavigate();
  const getLimit = useItemsLimit();
  const [isFilterOpen, setFilterOpen] = useState(false);

  const { collections: cacheCollections, excludeCollectionsCache } =
    useExtrinsicCacheEntities();

  const { order, page, search, onChangePagination } = useMyCollectionsContext();

  const isChildExist = useOutlet();

  const { collections, collectionsCount, isCollectionsLoading, isPagination, fetchMore } =
    useGraphQlCollectionsByAccount({
      accountAddress: selectedAccount?.address,
      options: {
        order,
        pagination: {
          page,
          limit: getLimit(),
        },
        search,
      },
    });

  const { synchronizedCollectionsIds } = useGraphQlCheckInExistCollectionsByAccount({
    collections: cacheCollections,
    skip: [cacheCollections.length, collections.length].includes(0),
  });

  useEffect(() => {
    if (synchronizedCollectionsIds.length > 0) {
      excludeCollectionsCache(synchronizedCollectionsIds);
    }
  }, [collections, synchronizedCollectionsIds, excludeCollectionsCache]);

  const onClickNavigate = (id: Collection['collection_id']) =>
    navigate(
      `/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}/${id}/${MY_COLLECTIONS_ROUTE.NFT}`,
    );

  const bottomBarButtons: BottomBarProps['buttons'] = [];

  if (!isFilterOpen) {
    bottomBarButtons.push(
      <Button
        title="Filter and sort"
        key="toggle-button"
        role="primary"
        onClick={() => setFilterOpen(!isFilterOpen)}
      />,
    );
  } else {
    bottomBarButtons.push([
      <Button
        key="Apply-button-filter"
        title="Apply"
        onClick={() => setFilterOpen(!isFilterOpen)}
      />,

      // TODO: next filters
      // <Button disabled key="Reset-button-filter" title="Reset" />,
    ]);
  }

  return (
    <PagePaper
      noPadding
      flexLayout="column"
      className={classNames('my-collections', className)}
    >
      {!isChildExist ? (
        <PagePaper.Layout
          header={
            <TopFilter
              showFilter={collections.length > 0 && deviceSize >= DeviceSize.lg}
            />
          }
        >
          <PagePaper.Processing>
            <ListEntitiesCache entities={cacheCollections} />
            <List
              isLoading={isCollectionsLoading}
              dataSource={collections}
              fetchMore={fetchMore}
              panelSettings={{
                pagination: {
                  current: page,
                  pageSizes: [getLimit()],
                  show: isPagination,
                  size: collectionsCount,
                  viewMode: 'bottom',
                },
                viewMode: 'both',
              }}
              renderItem={(collection: Collection) => (
                <List.Item key={collection.collection_id}>
                  <TokenLink
                    image={getTokenIpfsUriByImagePath(collection.collection_cover)}
                    title={`${collection.name} [id ${collection.collection_id}]`}
                    meta={
                      <>
                        <Text color="grey-500" size="s">
                          Items:{' '}
                        </Text>
                        <Text size="s">{collection.tokens_count || 0}</Text>
                      </>
                    }
                    key={collection.collection_id}
                    onTokenClick={() => onClickNavigate(collection.collection_id)}
                    onMetaClick={() => onClickNavigate(collection.collection_id)}
                  />
                </List.Item>
              )}
              visibleItems={getLimit()}
              onPageChange={onChangePagination}
            />
          </PagePaper.Processing>
          {deviceSize <= DeviceSize.md && (
            <BottomBar
              header={
                <BottomBarHeader
                  title="Filters and sort"
                  onBackClick={() => setFilterOpen(!isFilterOpen)}
                />
              }
              buttons={bottomBarButtons}
              isOpen={isFilterOpen}
              parent={document.body}
            >
              <TopFilter showFilter={collections.length > 0} view="column" />
            </BottomBar>
          )}
        </PagePaper.Layout>
      ) : (
        <Outlet />
      )}
    </PagePaper>
  );
};

const MyCollectionsWrapped = () => (
  <MyCollectionsWrapper>
    <MyCollectionsComponent />
  </MyCollectionsWrapper>
);

export const MyCollections = withPageTitle({ header: 'My collections' })(
  MyCollectionsWrapped,
);
