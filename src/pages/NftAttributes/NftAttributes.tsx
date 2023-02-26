import { Heading, Table, Text } from '@unique-nft/ui-kit';

import { CollectionStepper } from '../CreateCollection/components/CollectionStepper';

const NftAttributes = () => {
  return (
    <>
      <CollectionStepper activeStep={2} />
      <Heading size="2">NFT attributes</Heading>
      <Text>
        This functionality allows you to customize the token. You can define your NFT
        traits in the fields below. For example, name, accessory, gender, background,
        face, body, tier etc.
      </Text>
      <Table
        columns={[
          {
            title: 'Attribute',
            field: 'attribute',
            width: 'auto',
            iconRight: { size: 16, name: 'magnify' },
          },
          { title: 'Type', field: 'type', width: 'auto' },
          { title: 'Rule', field: 'rule', width: 'auto' },
          { title: 'Possible values', field: 'value', width: 'auto' },
        ]}
        data={[{}]}
      />
    </>
  );
};

export default NftAttributes;
