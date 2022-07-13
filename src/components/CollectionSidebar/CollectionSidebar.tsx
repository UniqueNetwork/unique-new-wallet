import { useContext, useMemo } from 'react';
import { Heading } from '@unique-nft/ui-kit';

import { CollectionFormContext } from '@app/context';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { Card } from '@app/pages/components/Card';

export const CollectionSidebar = () => {
  const { attributes, coverImgFile, mainInformationForm } =
    useContext(CollectionFormContext);
  const { values } = mainInformationForm;
  const { name, description, tokenPrefix } = values;

  const tags = useMemo(
    () => attributes.filter((attr) => attr.name !== 'ipfsJson').map(({ name }) => name),
    [attributes],
  );

  return (
    <WrapperSidebar>
      <SidebarRow>
        <Heading size="3">Collection preview</Heading>
        <Card
          title={name || 'Name'}
          description={description || 'Description'}
          picture={coverImgFile ? URL.createObjectURL(coverImgFile) : undefined}
        />
      </SidebarRow>
      <SidebarRow>
        <Heading size="3">NFT preview</Heading>
        <Card
          attributesInline={tags}
          title={tokenPrefix || 'Symbol'}
          description={name || 'Collection name'}
          geometry="square"
          picture={undefined}
        />
      </SidebarRow>
    </WrapperSidebar>
  );
};
