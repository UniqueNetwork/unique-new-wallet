import { Heading } from '@unique-nft/ui-kit';

import { SidebarRow, WrapperSidebar } from '@app/pages/components/PageComponents';
import { Card } from '@app/pages/components/Card';
import { useCollectionFormContext } from '@app/context/CollectionFormContext/useCollectionFormContext';
import { getTokenIpfsUriByImagePath } from '@app/utils';

export const CollectionSidebar = () => {
  // const { data } = useCollectionFormContext();
  // const { attributes, coverImgFile, mainInformationForm } =
  //   useContext(CollectionFormContext) || {};
  // const { values } = mainInformationForm;
  // const { name, description, tokenPrefix } = values;

  // const tags = useMemo(
  //   () => attributes.filter((attr) => attr.name !== 'ipfsJson').map(({ name }) => name),
  //   [attributes],
  // );

  return (
    <WrapperSidebar>
      {/* <SidebarRow>
        <Heading size="3">Collection preview</Heading>
        <Card
          title={data?.name || 'Name'}
          description={data?.description || 'Description'}
          picture={
            data?.schema?.coverPicture?.ipfsCid
              ? getTokenIpfsUriByImagePath(data.schema.coverPicture.ipfsCid)
              : undefined
          }
        />
      </SidebarRow>
      <SidebarRow>
        <Heading size="3">NFT preview</Heading>
        <Card
          // TODO: пустой массив
          attributesInline={[]}
          title={data?.tokenPrefix || 'Symbol'}
          description={data?.name || 'Collection name'}
          geometry="square"
          picture={undefined}
        />
      </SidebarRow> */}
    </WrapperSidebar>
  );
};
