import { useContext } from 'react';
import { Heading } from '@unique-nft/ui-kit';

import { CollectionFormContext } from '@app/context';
import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { Card } from '@app/pages/components/Card';

const attributes = ['Name', 'Gender', 'Traits'];

export const CollectionSidebar = () => {
  const { coverImgFile, mainInformationForm } = useContext(CollectionFormContext);
  const { values } = mainInformationForm;
  const { name, description, tokenPrefix } = values;

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
          attributesInline={attributes}
          title={tokenPrefix || 'tokenPrefix'}
          description="Collection name"
          geometry="square"
          picture={undefined}
        />
      </SidebarRow>
    </WrapperSidebar>
  );
};
