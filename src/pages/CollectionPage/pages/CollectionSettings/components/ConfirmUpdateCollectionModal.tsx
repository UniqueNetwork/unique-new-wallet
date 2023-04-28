import styled from 'styled-components';

import { Modal, ModalProps } from '@app/components/Modal';
import { ContentRow } from '@app/pages/components/ModalComponents';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { Typography, Loader, TransferBtn } from '@app/components';
import { useAccounts, useIsSufficientBalance } from '@app/hooks';
import { NOT_ENOUGH_BALANCE_MESSAGE } from '@app/pages/TokenDetails/Modals/constants';

type ConfirmUpdateCollectionModalProps = Omit<
  ModalProps,
  'children' | 'footerButtons' | 'title'
> & {
  onConfirm(): void;
  fee: string;
  isLoading: boolean;
  title: string;
  warning?: string;
};

export const ConfirmUpdateCollectionModal = ({
  onConfirm,
  fee,
  isLoading,
  warning,
  ...modalProps
}: ConfirmUpdateCollectionModalProps) => {
  const { selectedAccount } = useAccounts();

  const isSufficientBalance = useIsSufficientBalance(selectedAccount?.address, fee);
  return (
    <Modal
      footerButtons={
        <TransferBtn
          role="primary"
          title="Confirm"
          disabled={isLoading || !isSufficientBalance}
          tooltip={
            !isSufficientBalance
              ? `${NOT_ENOUGH_BALANCE_MESSAGE} ${selectedAccount?.unitBalance || 'coins'}`
              : null
          }
          onClick={onConfirm}
        />
      }
      {...modalProps}
    >
      {isLoading && <Loader isFullPage={true} />}
      {warning && (
        <ContentRow>
          <Typography>{warning}</Typography>
        </ContentRow>
      )}
      <AlertStyled fee={fee} />
    </Modal>
  );
};

const AlertStyled = styled(FeeInformationTransaction)`
  margin-bottom: 0 !important;
`;
