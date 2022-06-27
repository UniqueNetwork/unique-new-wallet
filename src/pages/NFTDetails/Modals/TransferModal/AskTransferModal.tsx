import React, { useCallback, useState, VFC } from 'react';
import { Button, Heading, InputText, Modal, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { AdditionalWarning100 } from '@app/styles/colors';

interface AskTransferModalProps {
  isVisible: boolean;
  onTransfer(receiver: string): void;
  onClose(): void;
}

export const AskTransferModal: VFC<AskTransferModalProps> = ({
  isVisible,
  onTransfer,
  onClose,
}) => {
  const [address, setAddress] = useState<string>('');
  const onAddressInputChange = (value: string) => {
    setAddress(value);
  };

  const onConfirmTransferClick = () => {
    if (!address) {
      return;
    }
    onTransfer(address);
  };

  return (
    <Modal isClosable isVisible={isVisible} onClose={onClose}>
      <HeadingWrapper>
        <Heading size="2">Transfer NFT</Heading>
      </HeadingWrapper>
      <InputWrapper
        label="Please enter the address you wish to send the NFT to"
        value={address}
        onChange={onAddressInputChange}
      />
      <TextStyled color="additional-warning-500" size="s">
        Proceed with caution, once confirmed the transaction cannot be reverted.
      </TextStyled>
      <TextStyled color="additional-warning-500" size="s">
        Make sure to use a Substrate address created with a Polkadot.&#123;js&#125;
        wallet. There is no guarantee that third-party wallets, exchanges or hardware
        wallets can successfully sign and process your transfer which will result in a
        possible loss of the NFT.
      </TextStyled>
      <ButtonWrapper>
        <Button
          disabled={!address}
          role="primary"
          title="Confirm"
          onClick={onConfirmTransferClick}
        />
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

const InputWrapper = styled(InputText)`
  margin-bottom: calc(var(--prop-gap) * 2);
  width: 100%;

  label {
    margin-bottom: var(--prop-gap);
  }
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
