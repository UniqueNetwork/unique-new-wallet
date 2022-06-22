import { Heading } from '@unique-nft/ui-kit';
import React, { useContext, VFC } from 'react';

import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';
import { useCollection } from '@app/hooks';

import { SidebarRow, WrapperSidebar } from './components';
import { Card } from './Card';
import { CollectionFormContext } from '../../context/CollectionFormContext/CollectionFormContext';

export interface SidebarProps {
  collectionId?: number;
}

export const Sidebar: VFC<SidebarProps> = ({ collectionId }) => {
  const { tokenImg } = useContext(CollectionFormContext);
  // const collection = useCollectionQuery(collectionId ?? '');
  const { collectionCover, name, description, tokenPrefix } = useCollection(
    collectionId ?? 0,
  );

  return (
    <WrapperSidebar>
      <SidebarRow>
        <Heading size="3">Collection preview</Heading>
        <Card title={description} description={description} picture={collectionCover} />
      </SidebarRow>
      <SidebarRow>
        <Heading size="3">NFT preview</Heading>
        {/* <Card
          title={tokenPrefix}
          description={name}
          attributes={[
            { group: 'Name', values: ['Name'] },
            { group: 'Gender', values: ['Female'] },
            {
              group: 'Traits',
              values: [
                'Eyes To The Right',
                'Eyes To The Left',
                'Eyes To The Up',
                'Eyes To The Down',
              ],
            },
          ]}
          geometry="square"
          picture={tokenImg ? URL.createObjectURL(tokenImg) : undefined}
        /> */}
      </SidebarRow>
    </WrapperSidebar>
  );
};
