import React, { useEffect } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { ROUTE } from '@app/routes';
import { useAccounts, useApi } from '@app/hooks';
import { AskBurnModal, BurnStagesModal } from '@app/pages/NFTDetails/Modals/BurnModal';
import { useTokenBurn } from '@app/api';
import { TToken } from '@app/pages/NFTDetails/type';

interface BurnModalProps<T> {
  isVisible: boolean;
  token?: T;
  onClose(): void;
  onComplete(): void;
}

export const BurnModal = <T extends TToken>({
  isVisible,
  token,
  onClose,
}: BurnModalProps<T>) => {
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
      collectionId: token.collectionId,
      tokenId: token.tokenId,
    });
  }, []);

  const burnHandler = () => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    submitWaitResult({
      payload: {
        address: selectedAccount.address,
        collectionId: token.collectionId,
        tokenId: token.tokenId,
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
