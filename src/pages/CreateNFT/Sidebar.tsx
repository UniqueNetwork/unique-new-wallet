import React, { VFC, memo } from 'react';

import { Heading } from '@app/components';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { Card } from '@app/pages/components/Card';

import { AttributeView } from './types';

export interface SidebarProps {
  collectionName?: string;
  collectionDescription?: string;
  collectionCoverUrl?: string | null;
  tokenPrefix?: string;
  tokenImageUrl?: string;
  attributes?: AttributeView[];
  hidden?: boolean;
}

const SidebarComponent: VFC<SidebarProps> = ({
  collectionName,
  collectionDescription,
  collectionCoverUrl,
  tokenPrefix,
  tokenImageUrl,
  attributes,
  hidden,
}) => {
  if (hidden) {
    return null;
  }

  return (
    <>
      <WrapperSidebar>
        <SidebarRow>
          <Heading size="3">Collection preview</Heading>
          <Card
            title={collectionName}
            description={collectionDescription}
            picture={collectionCoverUrl || undefined}
          />
        </SidebarRow>
        <SidebarRow>
          <Heading size="3">NFT preview</Heading>
          <Card
            geometry="square"
            title={tokenPrefix}
            description={collectionName}
            picture={tokenImageUrl || undefined}
            attributes={attributes}
          />
        </SidebarRow>
      </WrapperSidebar>
    </>
  );
};

export const Sidebar = memo(SidebarComponent);
