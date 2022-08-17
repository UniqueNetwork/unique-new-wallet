import React, { memo, VFC } from 'react';
import { Heading, Text, Tag } from '@unique-nft/ui-kit';
import styled from 'styled-components';

export type Attribute = {
  title: string;
  tags: string[];
};

interface TokenInformationProps {
  attributes?: Attribute[];
}
const AttributeRow = styled.div`
  margin-bottom: 16px;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: 'wrap';
  margin-top: 8px;
  gap: 8px;
`;

const TokenInformationComponent: VFC<TokenInformationProps> = ({ attributes }) => {
  return (
    <>
      <Heading size="4">Attributes</Heading>
      {attributes?.map(({ title, tags }, index) => (
        <AttributeRow key={`${title}${index}`}>
          <Text size="m" weight="light" color="grey-500">
            {title}
          </Text>
          <TagsRow>
            {tags.map((value, index) => (
              <Tag key={`${value}${index}`} label={value} />
            ))}
          </TagsRow>
        </AttributeRow>
      ))}
    </>
  );
};

export const TokenInformation = memo(TokenInformationComponent);
