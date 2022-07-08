import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import {
  AskTransferModal,
  TransferStagesModal,
} from '@app/pages/NFTDetails/Modals/TransferModal';
import { useExtrinsicFlow, ViewToken } from '@app/api';
import { TokenApiService } from '@app/api/restApi/token';
import { useApiExtrinsicFee } from '@app/api/restApi/hooks/useApiExtrinsicFee';

interface TransferModalProps {
  isVisible: boolean;
  token?: ViewToken;
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
  const { info, error } = useNotifications();
  const { fee, getFee } = useApiExtrinsicFee(TokenApiService.transferMutation);
  const {
    status,
    error: errorMessage,
    isLoading,
    signAndSubmitExtrinsic,
  } = useExtrinsicFlow(TokenApiService.transferMutation);

  const transferHandler = () => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    signAndSubmitExtrinsic({
      body: {
        to: recipient,
        from: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
      },
    });
  };

  useEffect(() => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    getFee({
      body: {
        to: recipient,
        from: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
      },
    });
  }, [recipient]);

  useEffect(() => {
    if (status === 'success') {
      info('Transfer completed successfully');
      onComplete();
    }

    if (status === 'error') {
      error(errorMessage?.message);
      onClose();
    }
  }, [status]);

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoading) {
    return <TransferStagesModal />;
  }

  return (
    <AskTransferModal
      fee={fee}
      isVisible={isVisible}
      recipient={recipient}
      onClose={onClose}
      onRecipientChange={setRecipient}
      onConfirm={transferHandler}
    />
  );
};
