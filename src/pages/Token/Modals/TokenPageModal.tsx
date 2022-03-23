import React, { FC, useEffect, useMemo, useState } from 'react';
import { Modal } from '@unique-nft/ui-kit';

import { Offer } from '../../../api/restApi/offers/types';
import { MinterType } from '../../../types/MinterTypes';
import { NFTToken } from '../../../api/chainApi/unique/types';

export type TTokenPageModalProps = {
  onFinish: () => void;
  offer?: Offer;
  token: NFTToken;
  // once button is clicked (sell/bid/etc) -> we will change minterType for modal and therefore this component decides what to show and how
  minterType: MinterType;
};

export type TTokenPageModalBodyProps = {
  setIsClosable: (value: boolean) => void;
  token: NFTToken;
  offer?: Offer;
  onFinish: () => void; // TODO: make a type, in future we would definitly wan't to pass smth like success/error/error.message
};

const TokenPageModal = ({
  onFinish,
  minterType,
  offer,
  token
}: TTokenPageModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosable, setIsClosable] = useState<boolean>(true);

  useEffect(() => {
    if (minterType === MinterType.default) setIsVisible(false);
    else setIsVisible(true);
  }, [minterType]);

  const ModalBodyComponent =
    useMemo<FC<TTokenPageModalBodyProps> | null>(() => {
      switch (minterType) {
        case MinterType.sellFix: // TODO: consider merdgin into one "sell" type?
        case MinterType.sellAuction:
          return () => <div>Modal</div>;
        case MinterType.bid:
          return () => <div>Modal</div>;
        case MinterType.withdrawBid:
          return () => <div>Modal</div>;
        case MinterType.delist:
          return () => <div>Modal</div>;
        case MinterType.delistAuction:
          return () => <div>Modal</div>;
        case MinterType.purchase:
          return () => <div>Modal</div>;
        case MinterType.transfer:
          return () => <div>Modal</div>;
        case MinterType.default:
        default:
          return null;
      }
    }, [minterType]);

  if (!ModalBodyComponent) return null;

  return (
    <Modal isVisible={isVisible} isClosable={isClosable} onClose={onFinish}>
      <ModalBodyComponent
        setIsClosable={setIsClosable}
        token={token}
        offer={offer}
        onFinish={onFinish}
      />
    </Modal>
  );
};

export default TokenPageModal;
