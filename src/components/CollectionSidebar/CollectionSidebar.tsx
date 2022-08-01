import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Heading } from '@unique-nft/ui-kit';

import { Card } from '@app/pages/components/Card';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { CreateCollectionFormType } from '@app/pages/CreateCollection/tabs';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { useCollectionFormContext } from '@app/context/CollectionFormContext/useCollectionFormContext';

export const CollectionSidebar = () => {
  const { setValue, control } = useFormContext<CreateCollectionFormType>();
  const { tokenPrefix, description, schema, name } = useWatch({ control });

  // const tags = useMemo(
  //   () => attributes.filter((attr) => attr.name !== 'ipfsJson').map(({ name }) => name),
  //   [attributes],
  // );

  return (
    <WrapperSidebar>
      <SidebarRow>
        <Heading size="3">Collection preview</Heading>
        <Card
          title={name || 'Name'}
          description={description || 'Description'}
          picture={
            schema?.coverPicture?.ipfsCid
              ? getTokenIpfsUriByImagePath(schema.coverPicture.ipfsCid)
              : undefined
          }
        />
      </SidebarRow>
      <SidebarRow>
        <Heading size="3">NFT preview</Heading>
        <Card
          // TODO: пустой массив
          attributesInline={[]}
          title={tokenPrefix || 'Symbol'}
          description={name || 'Collection name'}
          geometry="square"
          picture={undefined}
        />
      </SidebarRow>
    </WrapperSidebar>
  );
};
