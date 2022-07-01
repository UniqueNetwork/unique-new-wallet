import { Heading } from '@unique-nft/ui-kit';
import React, { useContext, useMemo, VFC } from 'react';
import get from 'lodash/get';

import { useCollectionCover } from '@app/hooks';
import { TokenFormContext } from '@app/context';
import { TokenField } from '@app/types';
import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { Card } from '@app/pages/components/Card';

export interface TokenFieldGroup {
  group: string;
  values: string[];
}

export interface SidebarProps {
  collectionId?: number;
}

export const Sidebar: VFC<SidebarProps> = ({ collectionId }) => {
  const { attributes, tokenImg } = useContext(TokenFormContext);
  const { data: collection } = useCollectionQuery(collectionId ?? 0);
  const collectionCover = useCollectionCover(collection);
  const tokenFields = get(collection, 'properties.fields', []);

  const fieldGroups = useMemo<TokenFieldGroup[]>(() => {
    const attrs: TokenFieldGroup[] = tokenFields
      ?.filter((field: TokenField) => field.name !== 'ipfsJson')
      .map((field: TokenField) => ({
        group: field.name,
        values:
          field.type === 'text'
            ? [attributes?.[field.name] ?? null]
            : attributes?.[field.name] ?? null,
      }));

    return attrs;
  }, [attributes, tokenFields]);

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
          attributes={fieldGroups}
          title={collection.tokenPrefix}
          description={collection.name}
          geometry="square"
          picture={tokenImg ? URL.createObjectURL(tokenImg) : undefined}
        />
      </SidebarRow>
    </WrapperSidebar>
  );
};
