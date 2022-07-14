import React, { useEffect, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Tabs } from '@unique-nft/ui-kit';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useGraphQlCollection } from '@app/api/graphQL/collections/collections';
import { useAccounts } from '@app/hooks';
import { CollectionsNftFilterWrapper } from '@app/pages/CollectionPage/components/CollectionNftFilters/CollectionsNftFilterWrapper';

import { CollectionNftFilters } from './components';
import { collectionContext } from './context';

interface CollectionPageComponentProps {
  basePath: string;
  className?: string;
}

const tabUrls = ['nft', 'settings'];
const activeTab = 0;

export const CollectionPageComponent: VFC<CollectionPageComponentProps> = ({
  basePath,
  className,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAccount } = useAccounts();
  const { collectionId } = useParams<'collectionId'>();
  const baseUrl = collectionId ? `${basePath}/${collectionId}` : basePath;
  const currentTabIndex = tabUrls.findIndex(
    (tab) => `${baseUrl}/${tab}` === location.pathname,
  );

  const collectionData = useGraphQlCollection(collectionId, selectedAccount?.address);

  const handleClick = (tabIndex: number) => {
    navigate(tabUrls[tabIndex]);
  };

  useEffect(() => {
    if (location.pathname === baseUrl) {
      navigate(tabUrls[activeTab]);
    }
  }, [baseUrl, location.pathname, navigate]);

  return (
    <CollectionsNftFilterWrapper>
      <div className={classNames('collection-page', className)}>
        <div className="tabs-header">
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
        </div>
        <collectionContext.Provider value={collectionData}>
          <Tabs activeIndex={currentTabIndex}>
            <Outlet />
            <Outlet />
          </Tabs>
        </collectionContext.Provider>
      </div>
    </CollectionsNftFilterWrapper>
  );
};

export const CollectionPage = styled(CollectionPageComponent)`
  .tabs-header {
    align-items: center;
    border-bottom: 1px solid var(--grey-300);
    display: flex;
    justify-content: space-between;
    padding: 0 calc(var(--prop-gap) * 2);
  }

  .unique-tabs-contents {
    padding: 0;
  }
`;
