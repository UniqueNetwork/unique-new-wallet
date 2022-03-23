import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Heading, Text } from '@unique-nft/ui-kit';
import { Trait } from './Trait';
import { TAttributes } from '../../../api/graphQL';

interface IProps {
  attributes: TAttributes;
}

export const AttributesBlock: FC<IProps> = ({ attributes }: IProps) => {
  const AttributesRow = ({
    attribute,
    enumeration
  }: {
    attribute: string;
    enumeration: string | string[];
  }) => (
    <React.Fragment key={attribute}>
      <Text color='grey-500' size='m'>
        {attribute}
      </Text>
      <Row>
        {typeof enumeration === 'string'
        ? (<Trait trait={enumeration} />)
        : (enumeration.map((trait) => <Trait key={trait} trait={trait} />))}
      </Row>
    </React.Fragment>
  );

  return (
    <div>
      <HeadingStyled size={'4'}>Attributes</HeadingStyled>
      {Object.keys(attributes).map((key) => {
        return AttributesRow({ attribute: key, enumeration: attributes[key] });
      })}
    </div>
  );
};

const HeadingStyled = styled(Heading)`
  && {
    margin-bottom: 16px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > div {
    margin-top: 10px;
  }

  &:not(:last-of-type) {
    margin-bottom: 16px;
  }
`;
