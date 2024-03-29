import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNotifications } from '@app/components';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { useAccounts, useApi, useIsSufficientBalance } from '@app/hooks';
import { AskBurnModal, BurnStagesModal } from '@app/pages/TokenDetails/Modals/BurnModal';
import { useTokenBurn, useTokenOwner } from '@app/api';
import { TBaseToken } from '@app/pages/TokenDetails/type';
import { TokenModalsProps } from '@app/pages/TokenDetails/Modals';

export const BurnModal = <T extends TBaseToken>({
  token,
  onClose,
}: TokenModalsProps<T>) => {
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
    feeLoading,
  } = useTokenBurn();

  const isSufficientBalance = useIsSufficientBalance(
    selectedAccount?.address,
    feeFormatted,
  );

  const { data: tokenOwner, isRefetching: isLoadingTokenOwner } = useTokenOwner({
    tokenId: token?.tokenId,
    collectionId: token?.collectionId,
  });

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
    if (!token || !selectedAccount?.address || !tokenOwner) {
      return;
    }

    getFee({
      address: selectedAccount.address,
      collectionId: token.collectionId,
      tokenId: token.tokenId,
      from: tokenOwner?.owner,
    });
  }, [tokenOwner]);

  const burnHandler = () => {
    if (!token || !selectedAccount?.address || !tokenOwner) {
      return;
    }

    submitWaitResult({
      payload: {
        address: selectedAccount.address,
        collectionId: token.collectionId,
        tokenId: token.tokenId,
        from: tokenOwner?.owner,
      },
    }).then(() => {
      info('Token burned successfully');

      navigate(
        `/${currentChain?.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
      );
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
      isLoading={isLoadingTokenOwner || feeLoading}
      isVisible={true}
      isSufficientBalance={!!isSufficientBalance}
      onBurn={burnHandler}
      onClose={onClose}
    />
  );
};
