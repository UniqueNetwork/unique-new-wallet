import { memo, VFC } from 'react';
import { Heading } from '@unique-nft/ui-kit';

import { Card } from '@app/pages/components/Card';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { CollectionForm } from '@app/pages/CreateCollection/types';

const CollectionSidebarComponent: VFC<{
  collectionForm: CollectionForm;
}> = ({ collectionForm }) => {
  const { name, description, symbol, coverPictureIpfsCid, attributes } = collectionForm;

  const attributesInline = attributes?.map<string>((attr) => attr.name || '');

  return (
    <WrapperSidebar>
      <SidebarRow>
        <Heading size="3">Collection preview</Heading>
        <Card
          title={name || 'Name'}
          description={description || 'Description'}
          picture={
            coverPictureIpfsCid
              ? getTokenIpfsUriByImagePath(coverPictureIpfsCid)
              : undefined
          }
        />
      </SidebarRow>
      <SidebarRow>
        <Heading size="3">NFT preview</Heading>
        <Card
          // TODO: пустой массив
          attributesInline={attributesInline}
          title={symbol || 'Symbol'}
          description={name || 'Collection name'}
          geometry="square"
          picture={undefined}
        />
      </SidebarRow>
    </WrapperSidebar>
  );
};

export const CollectionSidebar = memo(CollectionSidebarComponent);
