import { useEffect, useState, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import {
  AskTransferModal,
  TransferStagesModal,
} from '@app/pages/NFTDetails/Modals/TransferModal';
import { useTokenTransfer } from '@app/api';
import { Token } from '@app/api/graphQL/types';

interface TransferModalProps {
  isVisible: boolean;
  token?: Token;
  onComplete(): void;
  onClose(): void;
}

export const TransferModal: VFC<TransferModalProps> = ({
  isVisible,
  token,
  onComplete,
  onClose,
}) => {
  const [recipient, setRecipient] = useState<string | undefined>();

  const { selectedAccount } = useAccounts();
  const { info } = useNotifications();
  const { submitWaitResult, getFee, isLoadingSubmitResult, feeFormatted } =
    useTokenTransfer();

  const transferHandler = () => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    submitWaitResult({
      payload: {
        to: recipient,
        from: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
        address: selectedAccount.address,
      },
    })
      .then(() => {
        info('Transfer completed successfully');
        onComplete();
      })
      .catch(() => {
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
      collectionId: token.collection_id,
      tokenId: token.token_id,
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
