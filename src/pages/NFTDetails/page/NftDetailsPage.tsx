import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TokenByIdResponse } from '@unique-nft/sdk';
import { Button } from '@unique-nft/ui-kit';

import { NftDetailsLayout } from '@app/pages/NFTDetails/components/NftDetailsLayout';
import { NftDetailsCard } from '@app/pages/NFTDetails/components/NftDetailsCard';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';
import { useCollectionGetById, useTokenGetById } from '@app/api';
import { useIsOwner } from '@app/pages/NFTDetails/hooks/useIsOwner';
import { TransferBtn } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { DeviceSize, useDeviceSize } from '@app/hooks';

export const NftDetailsPage = () => {
  const { collectionId = '', tokenId = '' } = useParams();
  const size = useDeviceSize();

  const [currentModal, setCurrentModal] = useState<TNFTModalType>('none');

  const {
    data: tokenById,
    refetch: refetchToken,
    isLoading: isLoadingToken,
  } = useTokenGetById({
    tokenId: parseInt(tokenId),
    collectionId: parseInt(collectionId),
  });

  const {
    data: collection,
    isLoading: isLoadingCollection,
    refetch: refetchCollection,
  } = useCollectionGetById(parseInt(collectionId));

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
      name: collection ? `${collection.tokenPrefix} #${tokenById.tokenId}` : '',
      collectionName: collection?.name || '',
    };
  }, [tokenById, collection]);

  const isOwner = useIsOwner(token);

  const onModalClose = () => setCurrentModal('none');

  const onComplete = () => {
    refetchToken();
    refetchCollection();
    setCurrentModal('none');
  };

  return (
    <NftDetailsLayout
      isLoading={isLoadingToken || isLoadingCollection}
      tokenExist={!!token}
    >
      <NftDetailsCard
        token={token}
        isOwner={isOwner}
        buttons={
          isOwner && (
            <>
              <TransferBtn
                role="primary"
                title="Transfer"
                wide={size <= DeviceSize.sm}
                onClick={() => {
                  logUserEvent(UserEvents.TRANSFER_NFT);
                  setCurrentModal('transfer');
                }}
              />
              {collection?.permissions?.nesting?.tokenOwner && (
                <Button
                  title="Nest this token"
                  wide={size <= DeviceSize.sm}
                  onClick={() => {
                    logUserEvent(UserEvents.CREATE_BUNDLE);
                    setCurrentModal('create-bundle');
                  }}
                />
              )}
            </>
          )
        }
        onCurrentModal={setCurrentModal}
      />
      <NFTModals
        modalType={currentModal}
        token={token}
        onComplete={onComplete}
        onClose={onModalClose}
      />
    </NftDetailsLayout>
  );
};
