import {
  UnnestModal,
  ShareModal,
  BurnModal,
  TransferModal,
  TNFTModalType,
  CreateBundleModal,
  TransferNestedTokenModal,
} from '@app/pages/NFTDetails/Modals';
import { TBaseToken } from '@app/pages/NFTDetails/type';

export type NFTModalsProps<T> = {
  token?: T;
  onComplete(): void;
  onClose(): void;
};

type BaseNFTModalsProps<T> = NFTModalsProps<T> & {
  modalType: TNFTModalType;
};

export const NFTModals = <T extends TBaseToken>({
  modalType,
  token,
  onComplete,
  onClose,
}: BaseNFTModalsProps<T>) => {
  if (!token) {
    return null;
  }

  switch (modalType) {
    case 'transfer':
      return <TransferModal token={token} onClose={onClose} onComplete={onComplete} />;
    case 'share':
      return <ShareModal token={token} onClose={onClose} />;
    case 'burn':
      return <BurnModal token={token} onClose={onClose} onComplete={onComplete} />;

    case 'create-bundle':
      return (
        <CreateBundleModal token={token} onClose={onClose} onComplete={onComplete} />
      );

    case 'unnest':
      return <UnnestModal token={token} onClose={onClose} onComplete={onComplete} />;

    case 'bundle-transfer':
      return (
        <TransferNestedTokenModal
          token={token}
          onClose={onClose}
          onComplete={onComplete}
        />
      );
  }
  return null;
};
