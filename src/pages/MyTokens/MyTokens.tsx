import styled from 'styled-components';
import React, { useEffect, VFC } from 'react';
import classNames from 'classnames';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { TabsBody, TabsHeader } from '@app/pages/components/PageComponents';
import { PagePaper, Tabs } from '@app/components';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { useAccounts } from '@app/hooks';

import { TokensFilters } from './Tokens';
import { TokensWrapper } from './context';
import Stub from '../components/Stub';

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
  const { accounts } = useAccounts();

  useEffect(() => {
    if (location.pathname === basePath) {
      navigate(tabUrls[activeTab]);
    }
  }, [activeTab, basePath, location.pathname, navigate, tabUrls]);

  const currentTabIndex = tabUrls.findIndex((tab) =>
    location.pathname.includes(`${basePath}/${tab}`),
  );

  const handleClick = (tabIndex: number) => {
    navigate(tabUrls[tabIndex]);
  };

  if (!accounts.size) {
    return <Stub />;
  }

  return (
    <TokensWrapper>
      <PagePaper
        noPadding
        flexLayout="column"
        className={classNames('my-tokens', className)}
      >
        <TabsHeader>
          <Tabs
            activeIndex={currentTabIndex}
            labels={['Tokens', 'Coins']}
            type="slim"
            onClick={handleClick}
          />
          <Tabs activeIndex={currentTabIndex}>
            <TokensFilters />
            <></>
          </Tabs>
        </TabsHeader>
        <TabsBody>
          <Tabs activeIndex={currentTabIndex}>
            <Outlet />
            <Outlet />
          </Tabs>
        </TabsBody>
      </PagePaper>
    </TokensWrapper>
  );
};

const MyTokensStyled = styled(MyTokensComponent)``;

export const MyTokens = withPageTitle({ header: 'My tokens' })(MyTokensStyled);
