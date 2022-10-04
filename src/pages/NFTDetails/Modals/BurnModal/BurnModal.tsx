import React, { useEffect, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { ROUTE } from '@app/routes';
import { useAccounts, useApi } from '@app/hooks';
import { AskBurnModal, BurnStagesModal } from '@app/pages/NFTDetails/Modals/BurnModal';
import { Token } from '@app/api/graphQL/types';
import { useTokenBurn } from '@app/api';

interface BurnModalProps {
  isVisible: boolean;
  token?: Token;
  onClose(): void;
  onComplete(): void;
}

export const BurnModal: VFC<BurnModalProps> = ({ isVisible, token, onClose }) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const { selectedAccount } = useAccounts();
  const { info, error } = useNotifications();

  const {
    getFee,
    feeFormatted,
    submitWaitResult,
    isLoadingSubmitResult,
    feeError,
    submitWaitResultError,
  } = useTokenBurn();

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  useEffect(() => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    getFee({
      address: selectedAccount.address,
      collectionId: token.collection_id,
      tokenId: token.token_id,
    });
  }, []);

  const burnHandler = () => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    submitWaitResult({
      payload: {
        address: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
      },
    })
      .then(() => {
        info('NFT burned successfully');

        navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`);
      })
      .catch(() => {
        submitWaitResultError && error(submitWaitResultError);
      });
  };

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoadingSubmitResult) {
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
