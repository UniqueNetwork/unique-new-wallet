import { Heading } from '@unique-nft/ui-kit';
import React, { useContext, useMemo, VFC } from 'react';
import get from 'lodash/get';

import { useCollectionCover } from '@app/hooks';
import { TokenField } from '@app/types';
import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { Card } from '@app/pages/components/Card';
import { generateTokenFromValues } from '@app/utils';

export interface TokenFieldGroup {
  group: string;
  values: string[];
}

export interface SidebarProps {
  collectionName?: string;
  collectionDescription?: string;
  collectionCoverUrl?: string | null;
  tokenPrefix?: string;
  tokenImageUrl?: string;
  hidden?: boolean;
}

export const Sidebar: VFC<SidebarProps> = ({
  collectionName,
  collectionDescription,
  collectionCoverUrl,
  tokenPrefix,
  tokenImageUrl,
  hidden,
}) => {
  // const tokenFields = get(collection, 'properties.fields', []);
  // // const { values } = tokenForm;

  // const fieldGroups = useMemo<TokenFieldGroup[]>(() => {
  //   const attributes = generateTokenFromValues(values);
  //   const attrs: TokenFieldGroup[] = tokenFields
  //     ?.filter((field: TokenField) => field.name !== 'ipfsJson')
  //     .map((field: TokenField) => ({
  //       group: field.name,
  //       values:
  //         field.type === 'text'
  //           ? [attributes?.[field.name] ?? null]
  //           : attributes?.[field.name] ?? null,
  //     }));

  //   return attrs;
  // }, [tokenFields, values]);

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
            picture={collectionCoverUrl || ''}
          />
        </SidebarRow>
        <SidebarRow>
          <Heading size="3">NFT preview</Heading>
          <Card
            geometry="square"
            title={tokenPrefix}
            description={collectionName}
            picture={tokenImageUrl || undefined}
            attributes={[]}
          />
        </SidebarRow>
      </WrapperSidebar>
    </>
  );
};
