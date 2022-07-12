import React, { FC, useEffect, VFC } from 'react';
import { Modal, useNotifications } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import { Stages } from '@app/components';
import { useBalanceTransfer } from '@app/api';
import { Chain, NetworkType, StageStatus } from '@app/types';
import { useApi } from '@app/hooks';

import { SendFundsModal } from './SendFundsModal';

export interface SendFundsProps {
  isVisible: boolean;
  networkType?: NetworkType;
  senderAccount?: Account;
  onClose: () => void;
  onSendSuccess?(): void;
  chain: Chain;
}

const stages = [
  {
    title: 'Transfer in progress',
    status: StageStatus.inProgress,
  },
];

const TransferStagesModal: VFC = () => {
  return (
    <Modal isVisible isClosable={false}>
      <Stages stages={stages} />
    </Modal>
  );
};

export const SendFunds: FC<SendFundsProps> = (props) => {
  const { onClose, senderAccount, onSendSuccess, chain } = props;

  const { error, info } = useNotifications();
  const { setCurrentChain } = useApi();
  const { stage, fee, calculateFee, signTransferAndSubmit } = useBalanceTransfer();

  useEffect(() => {
    setCurrentChain(chain);
  }, [chain, setCurrentChain]);

  const amountChangeHandler = (
    senderAddress: string,
    destinationAddress: string,
    amount: number,
  ) => {
    calculateFee({ address: senderAddress, destination: destinationAddress, amount });
  };

  useEffect(() => {
    if (stage.status === StageStatus.success) {
      onSendSuccess?.();
    }
  }, [stage.status]);

  const confirmHandler = (
    senderAddress: string,
    destinationAddress: string,
    amount: number,
  ) => {
    signTransferAndSubmit({
      address: senderAddress,
      destination: destinationAddress,
      amount,
    });
  };

  useEffect(() => {
    if (stage.status === StageStatus.success) {
      info(stage.title);

      onClose();
    }
    if (stage.status === StageStatus.error) {
      error(stage.title);
    }
  }, [stage]);

  return (
    <>
      {stage.status === StageStatus.inProgress ? (
        <TransferStagesModal />
      ) : (
        <SendFundsModal
          {...props}
          fee={fee}
          senderAccount={senderAccount}
          onConfirm={confirmHandler}
          onAmountChange={amountChangeHandler}
        />
      )}
    </>
  );
};
