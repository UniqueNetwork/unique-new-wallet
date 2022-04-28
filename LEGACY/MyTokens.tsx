import React, { useCallback, useState } from 'react';
import { Tabs } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { NFTPage } from './NFTPage';
import { CoinsPage } from './CoinsPage';

export const MyTokensComponent = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleClick = useCallback((tabIndex: number) => {
    setActiveTab(tabIndex);
  }, [setActiveTab]);

  return (<>
    <Tabs
      activeIndex={activeTab}
      labels={['MyTokens', 'Coins']}
      onClick={handleClick}
      disabledIndexes={[1]}
    />
    <Tabs activeIndex={activeTab}>
      <NFTPage />
      <CoinsPage />
    </Tabs>
  </>);
};

export const MyTokens = styled(MyTokensComponent)``;