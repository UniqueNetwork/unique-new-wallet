import { useEffect, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import {
  AskTransferModal,
  TransferStagesModal,
} from '@app/pages/NFTDetails/Modals/TransferModal';
import { useTokenTransfer } from '@app/api';
import { TToken } from '@app/pages/NFTDetails/type';

interface TransferModalProps<T> {
  isVisible: boolean;
  token?: T;
  onComplete(): void;
  onClose(): void;
}

export const TransferModal = <T extends TToken>({
  isVisible,
  token,
  onComplete,
  onClose,
}: TransferModalProps<T>) => {
  const [recipient, setRecipient] = useState<string | undefined>();

  const { selectedAccount } = useAccounts();
  const { error, info } = useNotifications();
  const {
    submitWaitResult,
    getFee,
    isLoadingSubmitResult,
    feeFormatted,
    submitWaitResultError,
    feeError,
  } = useTokenTransfer();

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  const transferHandler = () => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    submitWaitResult({
      payload: {
        to: recipient,
        from: selectedAccount.address,
        collectionId: token.collectionId,
        tokenId: token.tokenId,
        address: selectedAccount.address,
      },
    })
      .then(() => {
        info('Transfer completed successfully');
        onComplete();
      })
      .catch(() => {
        submitWaitResultError && error(submitWaitResultError);
        onClose();
      });
  };

  useEffect(() => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    getFee({
      to: recipient,
      from: selectedAccount.address,
      collectionId: token.collectionId,
      tokenId: token.tokenId,
      address: selectedAccount.address,
    });
  }, [recipient]);

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoadingSubmitResult) {
    return <TransferStagesModal />;
  }

  return (
    <AskTransferModal
      fee={feeFormatted}
      isVisible={isVisible}
      recipient={recipient}
      onClose={onClose}
      onRecipientChange={setRecipient}
      onConfirm={transferHandler}
    />
  );
};
