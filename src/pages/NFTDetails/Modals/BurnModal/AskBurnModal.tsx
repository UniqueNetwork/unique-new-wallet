import React, { VFC } from 'react';
import { Button, Heading, Modal, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { AdditionalWarning100 } from '@app/styles/colors';

interface AskBurnModalProps {
  isVisible: boolean;
  onBurn(): void;
  onClose(): void;
}

export const AskBurnModal: VFC<AskBurnModalProps> = ({ isVisible, onBurn, onClose }) => {
  return (
    <Modal isClosable isVisible={isVisible} onClose={onClose}>
      <HeadingWrapper>
        <Heading size="2">Burn NFT</Heading>
      </HeadingWrapper>
      <Text size="m">You will not be able to undo this action.</Text>
      <TextStyled color="additional-warning-500" size="s">
        A fee of ~ 2.073447 QTZ can be applied to the transaction
      </TextStyled>
      <ButtonWrapper>
        <Button role="primary" title="Confirm" onClick={onBurn} />
      </ButtonWrapper>
    </Modal>
  );
};

const TextStyled = styled(Text)`
  box-sizing: border-box;
  display: flex;
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  margin-bottom: var(--prop-gap);
  border-radius: 4px;
  background-color: ${AdditionalWarning100};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: calc(var(--prop-gap) * 1.5);
`;

const HeadingWrapper = styled.div`
  && h2 {
    margin-bottom: calc(var(--prop-gap) * 2);
  }
`;
