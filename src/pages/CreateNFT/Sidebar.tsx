import { Heading } from '@unique-nft/ui-kit';
import React, { useContext, useMemo, VFC } from 'react';
import get from 'lodash/get';

import { useCollection, useCollectionCover } from '@app/hooks';
import { TokenFormContext } from '@app/context';
import { TokenField } from '@app/types';

import { SidebarRow, WrapperSidebar } from './components';
import { Card } from './Card';

export interface TokenFieldGroup {
  group: string;
  values: string[];
}

export interface SidebarProps {
  collectionId?: number;
}

export const Sidebar: VFC<SidebarProps> = ({ collectionId }) => {
  const { tokenImg } = useContext(TokenFormContext);
  const collection = useCollection(collectionId ?? 0);
  const collectionCover = useCollectionCover(collection);
  const tokenFields = get(collection, 'properties.fields', []);

  console.log('collection!', collection, 'tokenFields', tokenFields);

  const fieldGroups = useMemo<TokenFieldGroup[]>(() => {
    const attrs: TokenFieldGroup[] = tokenFields
      ?.filter((field: TokenField) => field.name !== 'ipfsJson')
      .map((field: TokenField) => ({
        group: field.name,
        values: [],
      }));
    /* [
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
          ]
     */

    return attrs;
  }, [tokenFields]);

  if (!collection) {
    return null;
  }

  return (
    <WrapperSidebar>
      <SidebarRow>
        <Heading size="3">Collection preview</Heading>
        <Card
          title={collection.name}
          description={collection.description}
          picture={collectionCover}
        />
      </SidebarRow>
      <SidebarRow>
        <Heading size="3">NFT preview</Heading>
        <Card
          title={collection.tokenPrefix}
          description={collection.name}
          attributes={fieldGroups}
          geometry="square"
          picture={tokenImg ? URL.createObjectURL(tokenImg) : undefined}
        />
      </SidebarRow>
    </WrapperSidebar>
  );
};
