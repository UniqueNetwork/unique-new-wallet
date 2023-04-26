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
};

export const ConfirmUpdateCollectionModal = ({
  onConfirm,
  fee,
  isLoading,
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
      <ContentRow>
        <Typography>You will not be able to undo this action.</Typography>
      </ContentRow>
      <ContentRow>
        <FeeInformationTransaction fee={fee} />
      </ContentRow>
    </Modal>
  );
};
