import { TNFTModalType } from '@app/pages/NFTDetails/Modals/types';
import { TransferModal } from '@app/pages/NFTDetails/Modals/TransferModal';
import { BurnModal } from '@app/pages/NFTDetails/Modals/BurnModal';
import { ShareModal } from '@app/pages/NFTDetails/Modals/ShareModal';
import { TToken } from '@app/pages/NFTDetails/type';
import { CreateBundleModal } from '@app/pages/NFTDetails/Modals/CreateBundleModal/CreateBundleModal';

export interface NFTModalsProps<T> {
  modalType: TNFTModalType;
  token?: T;
  onComplete(): void;
  onClose(): void;
}

export const NFTModals = <T extends TToken>({
  modalType,
  token,
  onComplete,
  onClose,
}: NFTModalsProps<T>) => {
  if (!token) {
    return null;
  }

  switch (modalType) {
    case 'transfer':
      return (
        <TransferModal
          isVisible={true}
          token={token}
          onClose={onClose}
          onComplete={onComplete}
        />
      );
    case 'share':
      return <ShareModal isVisible={true} token={token} onClose={onClose} />;
    case 'burn':
      return (
        <BurnModal
          isVisible={true}
          token={token}
          onClose={onClose}
          onComplete={onComplete}
        />
      );

    case 'create-bundle':
      return (
        <CreateBundleModal
          isVisible={true}
          token={token}
          onClose={onClose}
          onComplete={onComplete}
        />
      );
  }
  return null;
};
