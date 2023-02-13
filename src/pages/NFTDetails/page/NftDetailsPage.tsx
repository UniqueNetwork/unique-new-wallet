import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TokenByIdResponse } from '@unique-nft/sdk';
import { Button } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils';

import { NftDetailsLayout } from '@app/pages/NFTDetails/components/NftDetailsLayout';
import { NftDetailsCard } from '@app/pages/NFTDetails/components/NftDetailsCard';
import { NFTModals, TTokenModalType } from '@app/pages/NFTDetails/Modals';
import { useTokenGetBalance, useTokenGetById, useTokenGetTotalPieces } from '@app/api';
import { useIsOwner } from '@app/pages/NFTDetails/hooks/useIsOwner';
import { Achievement, ErrorPage, TransferBtn } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { DeviceSize, useAccounts, useApi, useDeviceSize } from '@app/hooks';
import { menuButtonsNft } from '@app/pages/NFTDetails/page/constants';
import AccountCard from '@app/pages/Accounts/components/AccountCard';

export const NftDetailsPage = () => {
  const { collectionId = '', tokenId = '', address = '' } = useParams();
  const size = useDeviceSize();
  const { currentChain } = useApi();
  const [isRefetching, setIsRefetching] = useState(false);
  const { selectedAccount } = useAccounts();

  const [currentModal, setCurrentModal] = useState<TTokenModalType>('none');

  const {
    data: tokenById,
    refetch: refetchToken,
    isLoading: isLoadingToken,
  } = useTokenGetById({
    tokenId: parseInt(tokenId),
    collectionId: parseInt(collectionId),
  });

  const token:
    | (TokenByIdResponse & {
        collectionName: string;
        name: string;
      })
    | undefined = useMemo(() => {
    if (!tokenById) {
      return undefined;
    }
    return {
      ...tokenById,
      name: `${tokenById.collection.tokenPrefix} #${tokenById.tokenId}`,
      collectionName: tokenById.collection?.name,
    };
  }, [tokenById]);

  const isFractional = token?.collection.mode === 'ReFungible';

  const isTokenOwner = useIsOwner(token);
  const isOwner = isFractional ? address === selectedAccount?.address : isTokenOwner;

  const { data: pieces, refetch: refetchTotalPieces } = useTokenGetTotalPieces({
    tokenId: parseInt(tokenId),
    collectionId: parseInt(collectionId),
  });

  const {
    data: balance,
    refetch: refetchTokenBalance,
    isFetching: isFetchingBalance,
  } = useTokenGetBalance({
    tokenId: parseInt(tokenId),
    collectionId: parseInt(collectionId),
    address,
    isFractional,
  });

  const onModalClose = () => setCurrentModal('none');

  const onComplete = async () => {
    setIsRefetching(true);
    const { data } = await refetchToken();
    if (data?.collection.mode === 'ReFungible') {
      await refetchTotalPieces();
      await refetchTokenBalance();
    }

    setIsRefetching(false);
    setCurrentModal('none');
  };

  const menuButtons = useMemo(() => {
    const items = [...menuButtonsNft];

    if (isOwner) {
      items.push({
        icon: 'burn',
        id: isFractional ? 'burn-refungible' : 'burn',
        title: 'Burn token',
        type: 'danger',
      });
    }

    return items;
  }, [isOwner, isFractional]);

  if (
    !isLoadingToken &&
    !isFetchingBalance &&
    !isRefetching &&
    token?.owner &&
    !(
      address === token.owner ||
      (Address.is.substrateAddress(address) &&
        Address.mirror.substrateToEthereum(address).toLowerCase().trim() === token.owner)
    )
  ) {
    return <ErrorPage />;
  }

  return (
    <NftDetailsLayout isLoading={isLoadingToken} tokenExist={!!token}>
      <NftDetailsCard
        token={token}
        menuButtons={menuButtons}
        isFractional={isFractional}
        balance={balance?.amount}
        pieces={pieces?.amount}
        achievement={
          isFractional && (
            <Achievement
              achievement="Fractional"
              tooltipDescription={
                <>
                  A&nbsp;fractional token provides a&nbsp;way for many users to&nbsp;own
                  a&nbsp;part of&nbsp;an&nbsp;NFT
                </>
              }
            />
          )
        }
        owner={
          isOwner ? (
            'You own it'
          ) : (
            <>
              Owned by
              <AccountCard
                accountAddress={isFractional ? address : token?.owner || ''}
                canCopy={false}
                scanLink={`${currentChain.uniquescanAddress}/account/${token?.owner}`}
              />
            </>
          )
        }
        buttons={
          isOwner && (
            <>
              <TransferBtn
                role="primary"
                title="Transfer"
                wide={size <= DeviceSize.sm}
                onClick={() => {
                  logUserEvent(UserEvents.TRANSFER_NFT);
                  setCurrentModal(isFractional ? 'transfer-refungible' : 'transfer');
                }}
              />

              {(isFractional ||
                tokenById?.collection?.permissions?.nesting?.tokenOwner) && (
                <Button
                  title="Nest this token"
                  wide={size <= DeviceSize.sm}
                  onClick={() => {
                    logUserEvent(UserEvents.CREATE_BUNDLE);
                    setCurrentModal(isFractional ? 'nest-refungible' : 'create-bundle');
                  }}
                />
              )}
            </>
          )
        }
        onCurrentModal={setCurrentModal}
      />
      <NFTModals<TokenByIdResponse & { collectionName: string; name: string }>
        modalType={currentModal}
        token={token}
        onComplete={onComplete}
        onClose={onModalClose}
      />
    </NftDetailsLayout>
  );
};
