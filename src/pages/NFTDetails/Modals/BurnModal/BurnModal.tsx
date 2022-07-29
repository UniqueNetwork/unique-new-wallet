import React, { useEffect, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { ROUTE } from '@app/routes';
import { useAccounts, useApi } from '@app/hooks';
import { TokenApiService, useExtrinsicFlow, useExtrinsicFee, ViewToken } from '@app/api';
import { AskBurnModal, BurnStagesModal } from '@app/pages/NFTDetails/Modals/BurnModal';

interface BurnModalProps {
  isVisible: boolean;
  token?: ViewToken;
  onClose(): void;
  onComplete(): void;
}

export const BurnModal: VFC<BurnModalProps> = ({ isVisible, token, onClose }) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const { selectedAccount } = useAccounts();
  const { info, error } = useNotifications();

  const { feeFormatted, getFee } = useExtrinsicFee(TokenApiService.burnMutation);
  const { flowStatus, isFlowLoading, flowError, signAndSubmitExtrinsic } =
    useExtrinsicFlow(TokenApiService.burnMutation);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('NFT burned successfully');

      navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`);
    }

    if (flowStatus === 'error') {
      error(flowError?.message);
    }
  }, [flowStatus]);

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

  if (isFlowLoading) {
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
