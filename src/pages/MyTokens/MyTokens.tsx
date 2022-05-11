import styled from 'styled-components';
import { Tabs } from '@unique-nft/ui-kit';
import React, { useEffect, VFC } from 'react';
import classNames from 'classnames';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { PagePaper } from '@app/components';

import { NFTFilters } from './NFTs';

interface MyTokensComponentProps {
  activeTab: number;
  basePath: string;
  className?: string;
  tabUrls: string[];
}

const MyTokensComponent: VFC<MyTokensComponentProps> = ({
  activeTab,
  basePath,
  className,
  tabUrls,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTabIndex = tabUrls.findIndex(
    (tab) => `${basePath}/${tab}` === location.pathname,
  );

  const handleClick = (tabIndex: number) => {
    navigate(tabUrls[tabIndex]);
  };

  useEffect(() => {
    if (location.pathname === basePath) {
      navigate(tabUrls[activeTab]);
    }
  }, [activeTab, basePath, location.pathname, navigate, tabUrls]);

  return (
    <PagePaper>
      <div className={classNames('my-tokens', className)}>
        <div className="tabs-header">
          <Tabs
            activeIndex={currentTabIndex}
            labels={['NFTs', 'Coins']}
            type="slim"
            onClick={handleClick}
          />
          <Tabs activeIndex={currentTabIndex}>
            <NFTFilters />
            <></>
          </Tabs>
        </div>
        <Tabs activeIndex={currentTabIndex}>
          <Outlet />
          <Outlet />
        </Tabs>
      </div>
    </PagePaper>
  );
};

export const MyTokens = styled(MyTokensComponent)`
  .tabs-header {
    align-items: center;
    border-bottom: 1px solid var(--color-grey-300);
    display: flex;
    justify-content: space-between;
  }

  .unique-tabs-contents {
    padding-top: 0;
  }
`;
