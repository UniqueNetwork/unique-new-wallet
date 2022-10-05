import { createRef, VFC } from 'react';
import styled from 'styled-components';
import { Alert, Button, Icon, InputText, Text, Tooltip } from '@unique-nft/ui-kit';

import { Modal } from '@app/components/Modal';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { ModalContent, ModalFooter } from '@app/pages/components/ModalComponents';

interface AskTransferModalProps {
  fee?: string;
  isVisible: boolean;
  recipient?: string;
  onClose: () => void;
  onConfirm: () => void;
  onRecipientChange: (recipient: string) => void;
}

const TransferRow = styled.div`
  margin-bottom: calc(var(--prop-gap) * 1.5);

  .unique-input-text {
    width: 100%;

    label {
      display: flex;
      align-items: center;
      margin-bottom: var(--prop-gap);
      gap: calc(var(--prop-gap) / 2.5);
    }
  }
`;

export const AskTransferModal: VFC<AskTransferModalProps> = ({
  fee,
  isVisible,
  recipient,
  onClose,
  onConfirm,
  onRecipientChange,
}) => {
  const tooltipRef = createRef<HTMLDivElement>();

  return (
    <Modal isVisible={isVisible} title="Transfer NFT" onClose={onClose}>
      <ModalContent>
        <TransferRow>
          <InputText
            label={
              <>
                <Tooltip
                  align={{
                    appearance: 'horizontal',
                    horizontal: 'right',
                    vertical: 'top',
                  }}
                  targetRef={tooltipRef}
                >
                  Make sure to&nbsp;use a&nbsp;Substrate address created with
                  a&nbsp;Polkadot.&#123;js&#125; wallet. There is&nbsp;no&nbsp;guarantee
                  that third-party wallets, exchanges or&nbsp;hardware wallets can
                  successfully sign and process your transfer which will result
                  in&nbsp;a&nbsp;possible loss of&nbsp;the NFT.
                </Tooltip>
                Recipient address
                <Icon
                  color="var(--color-primary-500)"
                  name="question"
                  ref={tooltipRef}
                  size={24}
                />
              </>
            }
            maxLength={49}
            value={recipient}
            onChange={onRecipientChange}
          />
        </TransferRow>
        <TransferRow>
          <Text>
            Proceed with caution, once confirmed the transaction cannot be reverted.
          </Text>
        </TransferRow>
        <TransferRow>
          <FeeInformationTransaction fee={fee} />
        </TransferRow>
        <TransferRow>
          {!fee && (
            <Alert type="warning">
              A fee will be calculated after entering the address
            </Alert>
          )}
        </TransferRow>
      </ModalContent>
      <ModalFooter>
        <Button
          role="primary"
          title="Confirm"
          disabled={!recipient}
          onClick={onConfirm}
        />
      </ModalFooter>
    </Modal>
  );
};
