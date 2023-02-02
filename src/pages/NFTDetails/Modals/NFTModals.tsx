import {
  UnnestModal,
  ShareModal,
  BurnModal,
  TransferModal,
  TTokenModalType,
  CreateBundleModal,
  TransferNestedTokenModal,
  TransferRefungibleModal,
  BurnRefungibleModal,
  NestRefungibleModal,
  UnnestRefungibleModal,
} from '@app/pages/NFTDetails/Modals';
import { TBaseToken } from '@app/pages/NFTDetails/type';

export type TokenModalsProps<T> = {
  token?: T;
  onComplete(): void;
  onClose(): void;
};

type BaseTokenModalsProps<T> = TokenModalsProps<T> & {
  modalType: TTokenModalType;
};

export const NFTModals = <T extends TBaseToken>({
  modalType,
  token,
  onComplete,
  onClose,
}: BaseTokenModalsProps<T>) => {
  if (!token) {
    return null;
  }

  switch (modalType) {
    case 'transfer':
      return <TransferModal token={token} onClose={onClose} onComplete={onComplete} />;
    case 'transfer-refungible':
      return (
        <TransferRefungibleModal
          token={token}
          onClose={onClose}
          onComplete={onComplete}
        />
      );

    case 'share':
      return <ShareModal token={token} onClose={onClose} />;
    case 'burn':
      return <BurnModal token={token} onClose={onClose} onComplete={onComplete} />;
    case 'burn-refungible':
      return (
        <BurnRefungibleModal token={token} onClose={onClose} onComplete={onComplete} />
      );

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
    case 'nest-refungible':
      return (
        <NestRefungibleModal token={token} onClose={onClose} onComplete={onComplete} />
      );
    case 'unnest-refungible':
      return (
        <UnnestRefungibleModal token={token} onClose={onClose} onComplete={onComplete} />
      );
  }
  return null;
};
