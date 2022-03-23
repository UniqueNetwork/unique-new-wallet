import { FC } from 'react';
import styled from 'styled-components/macro';
import { Text } from '@unique-nft/ui-kit';
import { Grey100 } from '../../../styles/colors';

export interface ITraitProps {
  trait: string;
}

export const Trait: FC<ITraitProps> = ({ trait }: ITraitProps) => (
  <TraitStyled>
    <Text
      color='secondary-300'
      size='s'
      weight='medium'
    >
      {trait}
    </Text>
  </TraitStyled>
);

const TraitStyled = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding: 1px 8px;
  border-radius: 4px;
  background-color: ${Grey100};

  &:not(:last-of-type) {
    margin-right: 8px;
  }
`;
