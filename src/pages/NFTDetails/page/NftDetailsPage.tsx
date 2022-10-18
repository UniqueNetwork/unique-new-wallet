import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { NftDetailsLayout } from '@app/pages/NFTDetails/components/NftDetailsLayout';
import { NftDetailsCard } from '@app/pages/NFTDetails/components/NftDetailsCard';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';
import { useTokenGetById } from '@app/api';
import { useIsOwner } from '@app/pages/NFTDetails/hooks/useIsOwner';
import { TransferBtn } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { DeviceSize, useDeviceSize } from '@app/hooks';

export const NftDetailsPage = () => {
  const { collectionId = '', tokenId = '' } = useParams();
  const size = useDeviceSize();

  const [currentModal, setCurrentModal] = useState<TNFTModalType>('none');

  const {
    data: token,
    refetch,
    isLoading,
  } = useTokenGetById({
    tokenId: parseInt(tokenId),
    collectionId: parseInt(collectionId),
  });

  const isOwner = useIsOwner(token);

  const onModalClose = () => setCurrentModal('none');

  const onComplete = () => {
    refetch();
    setCurrentModal('none');
  };

  return (
    <NftDetailsLayout isLoading={isLoading} tokenExist={!!token}>
      <NftDetailsCard
        token={token}
        isOwner={isOwner}
        buttons={
          isOwner && (
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
