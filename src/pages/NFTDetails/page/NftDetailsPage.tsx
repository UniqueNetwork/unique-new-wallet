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
import { NftDetailsWrapperButtons } from '@app/pages/NFTDetails/components';
import { menuButtonsNft } from '@app/pages/NFTDetails/page/constants';

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

  const menuButtons = useMemo(() => {
    const items = [...menuButtonsNft];

    if (isOwner) {
      items.push({
        icon: 'burn',
        id: 'burn',
        title: 'Burn token',
        type: 'danger',
      });
    }

    return items;
  }, [isOwner]);

  return (
    <NftDetailsLayout
      isLoading={isLoadingToken || isLoadingCollection}
      tokenExist={!!token}
    >
      <NftDetailsCard
        token={token}
        menuButtons={menuButtons}
        isOwner={isOwner}
        buttons={
          isOwner && (
            <NftDetailsWrapperButtons>
              <TransferBtn
                className="transfer-btn"
                title="Transfer"
                wide={size <= DeviceSize.sm}
                role="primary"
                onClick={() => {
                  logUserEvent(UserEvents.TRANSFER_NFT);
                  setCurrentModal('transfer');
                }}
              />
              {collection?.permissions?.nesting?.tokenOwner && (
                <Button
                  title="Nest this token"
                  onClick={() => {
                    logUserEvent(UserEvents.CREATE_BUNDLE);
                    setCurrentModal('create-bundle');
                  }}
                />
              )}
            </NftDetailsWrapperButtons>
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
