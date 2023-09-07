import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TokenByIdResponse } from '@unique-nft/sdk';
import { Address } from '@unique-nft/utils';
import styled from 'styled-components';

import { TokenDetailsLayout } from '@app/pages/TokenDetails/components/TokenDetailsLayout';
import { TokenDetailsCard } from '@app/pages/TokenDetails/components/TokenDetailsCard';
import { NFTModals, TTokenModalType } from '@app/pages/TokenDetails/Modals';
import { useTokenGetBalance, useTokenGetById, useTokenGetTotalPieces } from '@app/api';
import { useIsOwner } from '@app/pages/TokenDetails/hooks/useIsOwner';
import { Achievement, ErrorPage, TransferBtn, Button } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { DeviceSize, useAccounts, useApi, useDeviceSize } from '@app/hooks';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import {
  AngelHackBaseCollectionId,
  AngelHackWearablesCollectionId,
} from '@app/pages/MyTokens/constants';

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

  const renderAchievements = () => (
    <AchievementsWrapper>
      {tokenById?.collectionId === AngelHackBaseCollectionId[currentChain.network] && (
        <>
          <Achievement achievement="Base NFT" tooltipDescription={null} />
          <Achievement achievement="Soulbound" tooltipDescription={null} />
        </>
      )}
      {tokenById?.collectionId ===
        AngelHackWearablesCollectionId[currentChain.network] && (
        <Achievement achievement="Wearables" tooltipDescription={null} />
      )}
      {isFractional && (
        <Achievement
          achievement="Fractional"
          tooltipDescription={
            <>
              A&nbsp;fractional token provides a&nbsp;way for many users to&nbsp;own
              a&nbsp;part of&nbsp;an&nbsp;NFT
            </>
          }
        />
      )}
    </AchievementsWrapper>
  );

  return (
    <TokenDetailsLayout isLoading={isLoadingToken} tokenExist={!!token}>
      <TokenDetailsCard
        token={token}
        isFractional={isFractional}
        balance={balance?.amount}
        pieces={pieces?.amount}
        achievement={renderAchievements()}
        canBurn={isOwner}
        burnModal={isFractional ? 'burn-refungible' : 'burn'}
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
          isOwner &&
          token?.collection.limits?.transfersEnabled !== false && (
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
              <Button
                title="Nest this token"
                wide={size <= DeviceSize.sm}
                onClick={() => {
                  logUserEvent(UserEvents.CREATE_BUNDLE);
                  setCurrentModal(isFractional ? 'nest-refungible' : 'create-bundle');
                }}
              />
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
    </TokenDetailsLayout>
  );
};

const AchievementsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--prop-gap) / 2);
  align-items: flex-end;
  position: absolute;
  width: 100%;
  span {
    position: relative;
  }
`;
