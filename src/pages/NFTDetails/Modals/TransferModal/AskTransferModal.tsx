import { VFC } from 'react';
import { Button, Heading, InputText, Modal } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { Alert } from '@app/components/Alert';

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
        maxLength={49}
        value={recipient}
        onChange={onRecipientChange}
      />

      <FeeInformationTransaction fee={fee} />
      {!fee && (
        <AlertStyle type="warning">
          A fee will be calculated after entering the address
        </AlertStyle>
      )}
      <AlertStyle type="warning">
        Proceed with caution, once confirmed the transaction cannot be reverted.
      </AlertStyle>
      <AlertStyle type="warning">
        Make sure to use a Substrate address created with a Polkadot.&#123;js&#125;
        wallet. There is no guarantee that third-party wallets, exchanges or hardware
        wallets can successfully sign and process your transfer which will result in a
        possible loss of the NFT.
      </AlertStyle>
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

const AlertStyle = styled(Alert)`
  margin-top: var(--prop-gap);
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
