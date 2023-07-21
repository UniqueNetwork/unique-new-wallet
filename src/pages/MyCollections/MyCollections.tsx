import { useContext, useEffect, useState, VFC } from 'react';
import { Outlet, useNavigate, useOutlet } from 'react-router-dom';
import classNames from 'classnames';
import { Address } from '@unique-nft/utils';

import { Button, PagePaper, TokenLinkBase, Typography, List } from '@app/components';
import { MyCollectionsWrapper } from '@app/pages/MyCollections/MyCollectionsWrapper';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { MY_COLLECTIONS_ROUTE, MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import {
  DeviceSize,
  useAccounts,
  useApi,
  useDeviceSize,
  useItemsLimit,
  useTimer,
} from '@app/hooks';
import AccountContext from '@app/account/AccountContext';
import { useExtrinsicCacheEntities } from '@app/api';
import { Collection } from '@app/api/graphQL/types';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { useGraphQlCheckInExistCollectionsByAccount } from '@app/api/graphQL/collections/useGraphQlCheckInExistCollectionsByAccount';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import {
  BottomBar,
  BottomBarHeader,
  BottomBarProps,
} from '@app/pages/components/BottomBar';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';
import { usePageSettingContext } from '@app/context';

import { useMyCollectionsContext } from './context';
import { TopFilter } from './components';
import Stub from '../components/Stub';
import { NothingToDisplay } from '../components/NothingToDisplay';

interface MyCollectionsComponentProps {
  className?: string;
}

export const MyCollectionsComponent: VFC<MyCollectionsComponentProps> = ({
  className,
}) => {
  const { accounts } = useAccounts();
  const { currentChain } = useApi();
  const { selectedAccount } = useContext(AccountContext);
  const deviceSize = useDeviceSize();
  const navigate = useNavigate();
  const { limit } = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });
  const [isFilterOpen, setFilterOpen] = useState(false);
  const { setPageHeading, setBackLink } = usePageSettingContext();

  const { collections: cacheCollections, excludeCollectionsCache } =
    useExtrinsicCacheEntities();

  const { order, page, search, onChangePagination } = useMyCollectionsContext();

  const isChildExist = useOutlet();

  const {
    collections,
    collectionsCount,
    isCollectionsLoading,
    isPagination,
    fetchMore,
    refetchCollectionsByAccount,
  } = useGraphQlCollectionsByAccount({
    accountAddress:
      selectedAccount && Address.is.ethereumAddressInAnyForm(selectedAccount?.address)
        ? Address.mirror.ethereumToSubstrate(selectedAccount.address)
        : selectedAccount?.address,
    options: {
      order,
      pagination: {
        page,
        limit,
      },
      search,
    },
  });

  const { time, setTime } = useTimer(10);

  const { synchronizedCollectionsIds, refetchCheckInExistCollections } =
    useGraphQlCheckInExistCollectionsByAccount({
      collections: cacheCollections,
      skip: [cacheCollections.length, collections.length].includes(0),
    });

  useEffect(() => {
    if (time === 0 && cacheCollections.length > 0) {
      setTime(10);
      refetchCheckInExistCollections().then((res) => {
        (res.data?.collections?.data?.length || 0) > 0 && refetchCollectionsByAccount();
      });
    }
  }, [
    cacheCollections.length,
    refetchCollectionsByAccount,
    refetchCheckInExistCollections,
    setTime,
    time,
  ]);

  useEffect(() => {
    if (synchronizedCollectionsIds.length > 0) {
      excludeCollectionsCache(synchronizedCollectionsIds);
    }
  }, [collections, synchronizedCollectionsIds, excludeCollectionsCache]);

  const onClickNavigate = (id: Collection['collection_id']) =>
    navigate(
      `/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}/${id}/${MY_COLLECTIONS_ROUTE.NFT}`,
    );

  const onApplyFilterAndSorting = () => {
    setFilterOpen(!isFilterOpen);
  };

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
        onClick={onApplyFilterAndSorting}
      />,

      // TODO: next filters
      // <Button disabled key="Reset-button-filter" title="Reset" />,
    ]);
  }
  useEffect(() => {
    if (!accounts.size && isChildExist) {
      navigate(`/${currentChain.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
    }
  }, [accounts.size, isChildExist]);

  useEffect(() => {
    if (isChildExist) {
      setBackLink(ROUTE.MY_COLLECTIONS);
      return;
    }
    setPageHeading('My collections');
    setBackLink(null);
  }, [isChildExist]);

  if (!accounts.size) {
    return <Stub />;
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
              showFilter={
                (!!search || collectionsCount > 0) && deviceSize >= DeviceSize.lg
              }
            />
          }
        >
          <PagePaper.Processing>
            <ListEntitiesCache entities={cacheCollections} />
            <List
              isLoading={isCollectionsLoading}
              dataSource={collections}
              fetchMore={fetchMore}
              itemCols={{ sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
              panelSettings={{
                pagination: {
                  current: page,
                  pageSizes: [limit],
                  show: isPagination,
                  size: collectionsCount,
                  viewMode: 'bottom',
                },
                viewMode: 'both',
              }}
              noItemsIconName={search ? 'magnifier-found' : 'box'}
              noItemsTitle={search ? 'Nothing found' : <NothingToDisplay />}
              renderItem={(collection: Collection) => (
                <List.Item key={collection.collection_id}>
                  <TokenLinkBase
                    state={{ collectionName: collection.name }}
                    link={`/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}/${collection.collection_id}/${MY_COLLECTIONS_ROUTE.NFT}`}
                    image={getTokenIpfsUriByImagePath(collection.collection_cover)}
                    title={`${collection.name} [id ${collection.collection_id}]`}
                    meta={
                      <>
                        <Typography color="grey-500" size="s">
                          Items:{' '}
                        </Typography>
                        <Typography size="s">{collection.tokens_count || 0}</Typography>
                      </>
                    }
                    key={collection.collection_id}
                    onMetaClick={() => onClickNavigate(collection.collection_id)}
                  />
                </List.Item>
              )}
              visibleItems={limit}
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
              <TopFilter
                showFilter={true}
                view="column"
                onCloseFilter={() => setFilterOpen(!isFilterOpen)}
              />
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
