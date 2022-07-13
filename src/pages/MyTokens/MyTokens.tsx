import styled from 'styled-components';
import { Heading, Tabs } from '@unique-nft/ui-kit';
import React, { useEffect, VFC } from 'react';
import classNames from 'classnames';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { PagePaperNoPadding } from '@app/components';

import { NFTFilters } from './NFTs';
import { NFTsWrapper } from './context';

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

  useEffect(() => {
    if (location.pathname === basePath) {
      navigate(tabUrls[activeTab]);
    }
  }, [activeTab, basePath, location.pathname, navigate, tabUrls]);

  const currentTabIndex = tabUrls.findIndex(
    (tab) => `${basePath}/${tab}` === location.pathname,
  );

  const handleClick = (tabIndex: number) => {
    navigate(tabUrls[tabIndex]);
  };

  return (
    <NFTsWrapper>
      <Heading size="1">My tokens</Heading>
      <PagePaperNoPadding>
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
      </PagePaperNoPadding>
    </NFTsWrapper>
  );
};

export const MyTokens = styled(MyTokensComponent)`
  .tabs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 calc(var(--prop-gap) * 2);
    border-bottom: 1px solid var(--color-grey-300);
  }

  .unique-tabs-contents {
    padding-top: 0;
    padding-bottom: 0;
  }
`;
