import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import {
  AskTransferModal,
  TransferStagesModal,
} from '@app/pages/NFTDetails/Modals/TransferModal';
import { useExtrinsicSubmit, ViewToken } from '@app/api';
import { useTokenTransfer } from '@app/api/restApi/token';
import { useExtrinsicStatus } from '@app/api/restApi/extrinsic/hooks/useExtrinsicStatus';

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
  const { selectedAccount, signMessage } = useAccounts();
  const { tokenTransfer } = useTokenTransfer();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { info, error } = useNotifications();
  const [status, setStatus] = useState<'ask-transfer' | 'transfer-stages'>(
    'ask-transfer',
  );

  const [txHash, setTxHash] = useState<string>();
  const { data: extrinsicStatus } = useExtrinsicStatus(txHash);

  const onTransfer = useCallback(
    async (_recipient: string) => {
      if (!token || !selectedAccount?.address) {
        return;
      }

      setStatus('transfer-stages');
      try {
        const tx = await tokenTransfer({
          from: selectedAccount.address,
          to: _recipient,
          collectionId: token.collection_id,
          tokenId: token.token_id,
        });
        if (!tx) {
          // TODO: move this message to general dictionary
          throw new Error('Unexpected error');
        }

        const signature = await signMessage(tx.signerPayloadJSON);
        const submitResult = await submitExtrinsic({
          ...tx,
          signature,
        });

        if (submitResult) {
          setTxHash(submitResult.hash);
        }
      } catch (e) {
        // TODO: move this message to general dictionary
        error('Transfer cancelled');
        onClose();
      }
    },
    [setStatus],
  );

  useEffect(() => {
    if (!extrinsicStatus) {
      return;
    }
    const { isCompleted, isError, errorMessage } = extrinsicStatus;
    if (isCompleted) {
      onComplete();
      info('Transfer completed successfully');
    }
    if (isError) {
      error(errorMessage);
      onClose();
    }
  }, [extrinsicStatus]);

  if (!selectedAccount || !token) {
    return null;
  }

  if (status === 'ask-transfer') {
    return (
      <AskTransferModal isVisible={isVisible} onTransfer={onTransfer} onClose={onClose} />
    );
  }
  if (status === 'transfer-stages') {
    return <TransferStagesModal />;
  }
  return null;
};
