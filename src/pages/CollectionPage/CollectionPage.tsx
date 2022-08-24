import React, { useEffect, VFC } from 'react';
import { Tabs } from '@unique-nft/ui-kit';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAccounts, useApi } from '@app/hooks';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { useGraphQlCollectionById } from '@app/api/graphQL/collections';
import { ROUTE } from '@app/routes';
import { TabsBody, TabsHeader } from '@app/pages/components/PageComponents';
import { CollectionsNftFilterWrapper } from '@app/pages/CollectionPage/components/CollectionNftFilters/CollectionsNftFilterWrapper';
import { withPageTitle } from '@app/HOCs/withPageTitle';

import { CollectionNftFilters } from './components';
import { collectionContext } from './context';

const tabUrls = ['nft', 'settings'];
const activeTab = 0;

const CollectionPageComponent: VFC<{ basePath: string }> = ({ basePath }) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleClick = (tabIndex: number) => {
    navigate(tabUrls[tabIndex]);
  };

  useEffect(() => {
    logUserEvent(UserEvents.REVIEW_COLLECTION);
  }, []);

  useEffect(() => {
    if (location.pathname === baseUrl) {
      navigate(tabUrls[activeTab]);
    }
  }, [baseUrl, location.pathname, navigate]);

  return (
    <CollectionsNftFilterWrapper>
      <TabsHeader>
        <Tabs
          activeIndex={currentTabIndex}
          labels={['NFTs', 'Settings']}
          type="slim"
          onClick={handleClick}
        />
        <Tabs activeIndex={currentTabIndex}>
          <CollectionNftFilters />
          <></>
        </Tabs>
      </TabsHeader>
      <TabsBody>
        <collectionContext.Provider value={{ collection, collectionLoading: loading }}>
          <Tabs activeIndex={currentTabIndex}>
            <Outlet />
            <Outlet />
          </Tabs>
        </collectionContext.Provider>
      </TabsBody>
    </CollectionsNftFilterWrapper>
  );
};

export const CollectionPage = withPageTitle({ backLink: ROUTE.MY_COLLECTIONS })(
  CollectionPageComponent,
);
