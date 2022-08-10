import React, { useEffect, VFC } from 'react';
import { Tabs } from '@unique-nft/ui-kit';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useGraphQlCollection } from '@app/api/graphQL/collections/collections';
import { useAccounts, useApi } from '@app/hooks';
import { usePageSettingContext } from '@app/context';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { TabsBody, TabsHeader } from '@app/pages/components/PageComponents';
import { CollectionsNftFilterWrapper } from '@app/pages/CollectionPage/components/CollectionNftFilters/CollectionsNftFilterWrapper';

import { CollectionNftFilters } from './components';
import { collectionContext } from './context';

const tabUrls = ['nft', 'settings'];
const activeTab = 0;

export const CollectionPage: VFC<{ basePath: string }> = ({ basePath }) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAccount } = useAccounts();
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();
  const { collectionId } = useParams<'collectionId'>();
  const baseUrl = collectionId
    ? `/${currentChain?.network}/${basePath}/${collectionId}`
    : basePath;
  const currentTabIndex = tabUrls.findIndex(
    (tab) => `${baseUrl}/${tab}` === location.pathname,
  );
  const collectionData = useGraphQlCollection(collectionId, selectedAccount?.address);

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

  useEffect(() => {
    setPageBreadcrumbs({
      options: [
        {
          title: '🡠 back',
          link: '/my-collections',
        },
      ],
    });
    setPageHeading(collectionData?.collection?.name || '');
  }, [collectionData?.collection?.name]);

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
        <collectionContext.Provider value={collectionData}>
          <Tabs activeIndex={currentTabIndex}>
            <Outlet />
            <Outlet />
          </Tabs>
        </collectionContext.Provider>
      </TabsBody>
    </CollectionsNftFilterWrapper>
  );
};
