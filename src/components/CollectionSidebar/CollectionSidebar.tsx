import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Heading } from '@unique-nft/ui-kit';

import { Card } from '@app/pages/components/Card';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { CollectionForm } from '@app/pages/CreateCollection/types';

export const CollectionSidebar = () => {
  const { setValue, control } = useFormContext<CollectionForm>();
  const { symbol, description, coverPictureIpfsCid, name, attributes } = useWatch({
    control,
  });

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
