import React, { memo, VFC } from 'react';
import { Heading, Text, Tag } from '@unique-nft/ui-kit';

import { TAttributes } from '@app/api';

interface TokenInformationProps {
  attributes?: TAttributes;
}

const Attribute: VFC<{ name: string; value: TAttributes[keyof TAttributes] }> = ({
  name,
  value,
}) => {
  const valuesList = Array.isArray(value) ? value : [value];

  return (
    <div style={{ marginBottom: 16 }}>
      <Text size="m" weight="light" color="grey-500">
        {name}
      </Text>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        {valuesList.map((value, index) => (
          <Tag key={`${value}${index}`} label={value} />
        ))}
      </div>
    </div>
  );
};

const TokenInformationComponent: VFC<TokenInformationProps> = ({ attributes }) => {
  const attrsEntries = attributes ? Object.entries(attributes) : null;

  return (
    <>
      <Heading size="4">Attributes</Heading>
      {attrsEntries
        ?.filter((attr) => attr[0] !== 'ipfsJson')
        ?.map((attr) => (
          <Attribute key={attr[0]} name={attr[0]} value={attr[1]} />
        ))}
    </>
  );
};

export const TokenInformation = memo(TokenInformationComponent);
