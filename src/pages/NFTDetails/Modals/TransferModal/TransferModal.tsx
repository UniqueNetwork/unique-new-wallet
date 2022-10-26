import { useEffect, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import {
  AskTransferModal,
  TransferStagesModal,
} from '@app/pages/NFTDetails/Modals/TransferModal';
import { useTokenTransfer } from '@app/api';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { NFTModalsProps } from '@app/pages/NFTDetails/Modals';

export const TransferModal = <T extends TBaseToken>({
  token,
  onComplete,
  onClose,
}: NFTModalsProps<T>) => {
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

  useEffect(() => {
    if (!submitWaitResultError) {
      return;
    }
    error(submitWaitResultError);
  }, [submitWaitResultError]);

  const transferHandler = async () => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    try {
      await submitWaitResult({
        payload: {
          to: recipient,
          from: selectedAccount.address,
          collectionId: token.collectionId,
          tokenId: token.tokenId,
          address: selectedAccount.address,
        },
      });

      info('Transfer completed successfully');
      onComplete();
    } catch {
      onClose();
    }
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
      isVisible={true}
      recipient={recipient}
      onClose={onClose}
      onRecipientChange={setRecipient}
      onConfirm={transferHandler}
    />
  );
};
