import React, { VFC } from 'react';
import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { AdditionalWarning100 } from '@app/styles/colors';
import { Confirm } from '@app/components';

interface AskBurnModalProps {
  fee: string;
  isVisible: boolean;
  onBurn(): void;
  onClose(): void;
}

export const AskBurnModal: VFC<AskBurnModalProps> = ({
  fee,
  isVisible,
  onBurn,
  onClose,
}) => {
  return (
    <Confirm
      isVisible={isVisible}
      title="Burn NFT"
      buttons={[{ title: 'Confirm', role: 'primary', onClick: onBurn }]}
      onClose={onClose}
    >
      <Text size="m">You will not be able to undo this action.</Text>
      <TextStyled color="additional-warning-500" size="s">
        A fee of ~ {fee} can be applied to the transaction
      </TextStyled>
    </Confirm>
  );
};

const TextStyled = styled(Text)`
  box-sizing: border-box;
  display: flex;
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  margin: var(--prop-gap) 0;
  border-radius: 4px;
  background-color: ${AdditionalWarning100};
  width: 100%;
`;
