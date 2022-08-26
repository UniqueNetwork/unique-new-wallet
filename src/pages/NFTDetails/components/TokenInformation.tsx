import React, { memo, VFC } from 'react';
import styled from 'styled-components';
import { Heading, Text, Tag } from '@unique-nft/ui-kit';

export type Attribute = {
  title: string;
  tags: string[];
};

interface TokenInformationProps {
  attributes?: Attribute[];
  className?: string;
}

const TokenInformationComponent: VFC<TokenInformationProps> = ({
  attributes,
  className,
}) => {
  return (
    <div className={className}>
      <Heading className="attributes-header" size="4">
        Attributes
      </Heading>
      {attributes?.map(({ title, tags }, index) => (
        <div className="attribute-row" key={`${title}${index}`}>
          <Text size="m" weight="light" color="grey-500">
            {title}
          </Text>
          <div className="tags-row">
            {tags.map((value, index) => (
              <Tag key={`${value}${index}`} label={value} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const TokenInformationStyled = styled(TokenInformationComponent)`
  .attributes-header,
  .attribute-row {
    margin-bottom: var(--prop-gap);
  }

  .tags-row {
    display: flex;
    flex-wrap: wrap;
    margin-top: 8px;
    gap: 8px;
  }
`;

export const TokenInformation = memo(TokenInformationStyled);
