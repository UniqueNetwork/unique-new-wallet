import { useEffect, useState, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import {
  AskTransferModal,
  TransferStagesModal,
} from '@app/pages/NFTDetails/Modals/TransferModal';
import { useExtrinsicFee, useExtrinsicFlow } from '@app/api';
import { TokenApiService } from '@app/api/restApi/token';
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
  const { info, error } = useNotifications();
  const { feeFormatted, getFee } = useExtrinsicFee(TokenApiService.transferMutation);
  const { flowStatus, flowError, isFlowLoading, signAndSubmitExtrinsic } =
    useExtrinsicFlow(TokenApiService.transferMutation);

  const transferHandler = () => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    signAndSubmitExtrinsic({
      payload: {
        to: recipient,
        from: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
        address: selectedAccount.address,
      },
    });
  };

  useEffect(() => {
    if (!token || !recipient || !selectedAccount?.address) {
      return;
    }

    getFee({
      payload: {
        to: recipient,
        from: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
        address: selectedAccount.address,
      },
    });
  }, [recipient]);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('Transfer completed successfully');
      onComplete();
    }

    if (flowStatus === 'error') {
      error(flowError?.message);
      onClose();
    }
  }, [flowStatus]);

  if (!selectedAccount || !token) {
    return null;
  }

  if (isFlowLoading) {
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
