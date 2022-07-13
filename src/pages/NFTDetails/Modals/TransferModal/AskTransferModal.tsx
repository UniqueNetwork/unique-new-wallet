import { VFC } from 'react';
import { Button, Heading, InputText, Modal, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { AdditionalWarning100 } from '@app/styles/colors';

interface AskTransferModalProps {
  fee?: string;
  isVisible: boolean;
  recipient?: string;
  onClose: () => void;
  onConfirm: () => void;
  onRecipientChange: (recipient: string) => void;
}

export const AskTransferModal: VFC<AskTransferModalProps> = ({
  fee,
  isVisible,
  recipient,
  onClose,
  onConfirm,
  onRecipientChange,
}) => {
  return (
    <Modal isClosable isVisible={isVisible} onClose={onClose}>
      <HeadingWrapper>
        <Heading size="2">Transfer NFT</Heading>
      </HeadingWrapper>
      <InputWrapper
        label="Please enter the address you wish to send the NFT to"
        maxLength={48}
        value={recipient}
        onChange={onRecipientChange}
      />
      {fee && (
        <TextStyled appearance="block" color="additional-warning-500" size="s">
          A fee of ~ {fee} can be applied to the transaction
        </TextStyled>
      )}
      <TextStyled appearance="block" color="additional-warning-500" size="s">
        Proceed with caution, once confirmed the transaction cannot be reverted.
      </TextStyled>
      <TextStyled appearance="block" color="additional-warning-500" size="s">
        Make sure to use a Substrate address created with a Polkadot.&#123;js&#125;
        wallet. There is no guarantee that third-party wallets, exchanges or hardware
        wallets can successfully sign and process your transfer which will result in a
        possible loss of the NFT.
      </TextStyled>
      <ButtonWrapper>
        <Button
          role="primary"
          title="Confirm"
          disabled={!recipient}
          onClick={onConfirm}
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
