import React, { useEffect, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { ROUTE } from '@app/routes';
import { useAccounts } from '@app/hooks';
import { TokenApiService, useExtrinsicFlow, useExtrinsicFee, ViewToken } from '@app/api';
import { AskBurnModal, BurnStagesModal } from '@app/pages/NFTDetails/Modals/BurnModal';

interface BurnModalProps {
  isVisible: boolean;
  token?: ViewToken;
  onClose(): void;
  onComplete(): void;
}

export const BurnModal: VFC<BurnModalProps> = ({ isVisible, token, onClose }) => {
  const navigate = useNavigate();
  const { selectedAccount } = useAccounts();
  const { info, error } = useNotifications();

  const { feeFormatted, getFee } = useExtrinsicFee(TokenApiService.burnMutation);
  const {
    status,
    isLoading,
    error: errorMessage,
    signAndSubmitExtrinsic,
  } = useExtrinsicFlow(TokenApiService.burnMutation);

  useEffect(() => {
    if (status === 'success') {
      info('Collection created successfully');

      navigate(ROUTE.MY_TOKENS);
    }

    if (status === 'error') {
      error(errorMessage?.message);
    }
  }, [status]);

  useEffect(() => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    getFee({
      body: {
        address: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
      },
    });
  }, []);

  const burnHandler = () => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    signAndSubmitExtrinsic({
      body: {
        address: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
      },
    });
  };

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoading) {
    return <BurnStagesModal />;
  }

  return (
    <AskBurnModal
      fee={feeFormatted ?? ''}
      isVisible={isVisible}
      onBurn={burnHandler}
      onClose={onClose}
    />
  );
};
