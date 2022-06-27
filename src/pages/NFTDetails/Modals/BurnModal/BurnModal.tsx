import React, { useEffect, useState, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import { useExtrinsicSubmit, ViewToken } from '@app/api';
import { AskBurnModal, BurnStagesModal } from '@app/pages/NFTDetails/Modals/BurnModal';
import { useExtrinsicStatus } from '@app/api/restApi/extrinsic/hooks/useExtrinsicStatus';
import { useTokenBurn } from '@app/api/restApi/token/hooks/useTokenBurn';

interface BurnModalProps {
  isVisible: boolean;
  token?: ViewToken;
  onClose(): void;
  onComplete(): void;
}

export const BurnModal: VFC<BurnModalProps> = ({
  isVisible,
  token,
  onClose,
  onComplete,
}) => {
  const { selectedAccount, signMessage } = useAccounts();
  const { tokenBurn } = useTokenBurn();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { info, error } = useNotifications();
  const [status, setStatus] = useState<'ask-burn' | 'burn-stages'>('ask-burn');

  const [txHash, setTxHash] = useState<string>();
  const { data: extrinsicStatus } = useExtrinsicStatus(txHash);

  const onBurn = async () => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    setStatus('burn-stages');
    try {
      const tx = await tokenBurn({
        address: selectedAccount.address,
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
  };

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

  if (status === 'ask-burn') {
    return (
      <AskBurnModal
        isVisible={isVisible}
        onBurn={() => {
          void onBurn();
        }}
        onClose={onClose}
      />
    );
  }
  if (status === 'burn-stages') {
    return <BurnStagesModal />;
  }
  return null;
};
