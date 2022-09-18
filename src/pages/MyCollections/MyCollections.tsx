import { useContext, useState, VFC } from 'react';
import { Outlet, useNavigate, useOutlet } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Text } from '@unique-nft/ui-kit';

import { PagePaper, TokenLink } from '@app/components';
import { MyCollectionsWrapper } from '@app/pages/MyCollections/MyCollectionsWrapper';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { MY_COLLECTIONS_ROUTE, ROUTE } from '@app/routes';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import AccountContext from '@app/account/AccountContext';
import { Collection } from '@app/api/graphQL/types';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import List from '@app/components/List';
import {
  BottomBar,
  BottomBarHeader,
  BottomBarProps,
} from '@app/pages/components/BottomBar';

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
  const [isFilterOpen, setFilterOpen] = useState(false);

  // TODO: move method to utils
  const getItems = () => {
    switch (deviceSize) {
      case DeviceSize.sm:
        return 8;
      case DeviceSize.md:
        return 9;
      case DeviceSize.lg:
        return 8;
      default:
        return 10;
    }
  };

  // TODO: get limit correctly
  const [limit, setLimit] = useState(getItems);

  const { order, page, search, onChangePagination } = useMyCollectionsContext();

  const isChildExist = useOutlet();

  const {
    collections,
    collectionsCount,
    isCollectionsLoading,
    isPagination,
    fetchMoreMethod,
  } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: {
      order,
      pagination: {
        page,
        limit: getItems(),
      },
      search,
    },
  });

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

  const onFetchMore = () => {
    if (fetchMoreMethod) {
      const newLimit = limit + getItems();

      fetchMoreMethod({
        // @ts-ignore
        variables: {
          limit: newLimit,
        },
      });

      setLimit(newLimit);
    }
  };

  return (
    <PagePaper
      noPadding
      className={classNames('my-collections', className)}
      flexLayout={isChildExist ? 'column' : 'row'}
    >
      {!isChildExist ? (
        <PagePaper.Layout
          header={
            deviceSize >= DeviceSize.lg && (
              <TopFilter showFilter={collections.length > 0} />
            )
          }
        >
          <List
            isLoading={isCollectionsLoading}
            dataSource={collections}
            loadMoreHandle={onFetchMore}
            panelSettings={{
              pagination: {
                current: page,
                pageSizes: [getItems()],
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
                  title={`${collection.name} [${collection.collection_id}]`}
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
            //@ts-ignore
            showMore={fetchMoreMethod && collectionsCount >= limit}
            onPageChange={onChangePagination}
          />
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
