import styled from 'styled-components';
import { Tabs } from '@unique-nft/ui-kit';
import React, { useEffect, VFC } from 'react';
import classNames from 'classnames';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { usePageSettingContext } from '@app/context';
import { TabsBody, TabsHeader } from '@app/pages/components/PageComponents';
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
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();

  useEffect(() => {
    if (location.pathname === basePath) {
      navigate(tabUrls[activeTab]);
    }
  }, [activeTab, basePath, location.pathname, navigate, tabUrls]);

  useEffect(() => {
    setPageBreadcrumbs({ options: [] });
    setPageHeading('My tokens');
  }, []);

  const currentTabIndex = tabUrls.findIndex((tab) =>
    location.pathname.includes(`${basePath}/${tab}`),
  );

  const handleClick = (tabIndex: number) => {
    navigate(tabUrls[tabIndex]);
  };

  useEffect(() => {
    navigate(tabUrls[activeTab]);
  }, []);

  return (
    <NFTsWrapper>
      <PagePaperNoPadding className={classNames('data-grid', 'my-tokens', className)}>
        <TabsHeader>
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
        </TabsHeader>
        <TabsBody>
          <Tabs activeIndex={currentTabIndex}>
            <Outlet />
            <Outlet />
          </Tabs>
        </TabsBody>
      </PagePaperNoPadding>
    </NFTsWrapper>
  );
};

export const MyTokens = styled(MyTokensComponent)``;
