import React, { useEffect, VFC } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAccounts, useApi } from '@app/hooks';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { useGraphQlCollectionById } from '@app/api/graphQL/collections';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { TabsBody, TabsHeader } from '@app/pages/components/PageComponents';
import { CollectionsNftFilterWrapper } from '@app/pages/CollectionPage/components/CollectionNftFilters/CollectionsNftFilterWrapper';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { TokenTypeEnum } from '@app/api/graphQL/types';
import { Tabs } from '@app/components';

import { CollectionNftFilters } from './components';
import { collectionContext } from './context';

const tabUrls = ['nft', 'settings'];
const activeTab = 0;

const CollectionPageComponent: VFC<{ basePath: string }> = ({ basePath }) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAccount, isLoading } = useAccounts();
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

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!selectedAccount) {
      navigate(`/${currentChain.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
    }
  }, [selectedAccount, isLoading]);

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

  const TokenTabTitle = collection?.mode === TokenTypeEnum.RFT ? 'Fractional' : 'NFTs';

  return (
    <CollectionsNftFilterWrapper>
      <TabsHeader>
        <Tabs
          activeIndex={currentTabIndex}
          labels={[TokenTabTitle, 'Settings']}
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
