import React, { useEffect, VFC } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAccounts, useApi, useIsFirstRender } from '@app/hooks';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { useGraphQlCollectionById } from '@app/api/graphQL/collections';
import { MY_COLLECTIONS_ROUTE, ROUTE } from '@app/routes';
import { TabsBody, TabsHeader } from '@app/pages/components/PageComponents';
import { CollectionsNftFilterWrapper } from '@app/pages/CollectionPage/components/CollectionNftFilters/CollectionsNftFilterWrapper';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { Tabs } from '@app/components';
import { useCollectionGetById } from '@app/api';
import { usePageSettingContext } from '@app/context';

import { CollectionNftFilters } from './components';
import { collectionContext } from './context';

const tabUrls = ['nft', 'settings'];
const activeTab = 0;

const CollectionPageComponent: VFC<{ basePath: string }> = ({ basePath }) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const { setPageHeading } = usePageSettingContext();
  const { selectedAccount } = useAccounts();
  const { collectionId } = useParams<'collectionId'>();
  const baseUrl = collectionId
    ? `/${currentChain?.network}/${basePath}/${collectionId}`
    : basePath;
  const currentTabIndex = tabUrls.findIndex(
    (tab) => `${baseUrl}/${tab}` === location.pathname,
  );
  const { collection, loading } = useGraphQlCollectionById(
    parseInt(collectionId || ''),
    selectedAccount?.address,
  );
  const {
    data: collectionSettings,
    isLoading,
    refetch: refetchSettings,
  } = useCollectionGetById(parseInt(collectionId || ''));

  useEffect(() => {
    if (location.pathname === baseUrl) {
      navigate(tabUrls[activeTab]);
    }
  }, [baseUrl, location.pathname]);

  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    navigate(`/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}/`);
  }, [selectedAccount?.address]);

  const handleClick = (tabIndex: number) => {
    navigate(tabUrls[tabIndex]);
  };

  useEffect(() => {
    logUserEvent(UserEvents.REVIEW_COLLECTION);
  }, []);

  useEffect(() => {
    if (loading || !collection) {
      setPageHeading(
        (location.state as { collectionName?: string })?.collectionName || ' ',
      );
      return;
    }
    setPageHeading(collection.name);
  }, [setPageHeading, collection, loading]);

  return (
    <CollectionsNftFilterWrapper>
      <collectionContext.Provider
        value={{
          collection,
          collectionSettings,
          collectionLoading: isLoading || loading,
          refetchSettings,
        }}
      >
        <TabsHeader>
          <Tabs
            activeIndex={currentTabIndex}
            labels={['Tokens', 'Settings']}
            type="slim"
            onClick={handleClick}
          />
          <Tabs activeIndex={currentTabIndex}>
            <CollectionNftFilters />
            <></>
          </Tabs>
        </TabsHeader>
        <TabsBody>
          <Tabs activeIndex={currentTabIndex}>
            <Outlet />
            <Outlet />
          </Tabs>
        </TabsBody>
      </collectionContext.Provider>
    </CollectionsNftFilterWrapper>
  );
};

export const CollectionPage = withPageTitle({ backLink: ROUTE.MY_COLLECTIONS })(
  CollectionPageComponent,
);
