import React, { useEffect } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { ROUTE } from '@app/routes';
import { useAccounts, useApi } from '@app/hooks';
import { AskBurnModal, BurnStagesModal } from '@app/pages/NFTDetails/Modals/BurnModal';
import { useTokenBurn } from '@app/api';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { NFTModalsProps } from '@app/pages/NFTDetails/Modals';

export const BurnModal = <T extends TBaseToken>({
  token,
  onClose,
}: NFTModalsProps<T>) => {
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
    if (!submitWaitResultError) {
      return;
    }
    error(submitWaitResultError);
  }, [submitWaitResultError]);

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
    }).then(() => {
      info('NFT burned successfully');

      navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`);
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
      isVisible={true}
      onBurn={burnHandler}
      onClose={onClose}
    />
  );
};
