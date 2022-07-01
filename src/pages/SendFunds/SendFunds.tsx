import React, { FC, useCallback, useEffect, VFC } from 'react';
import { Modal, useNotifications } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import { Stages } from '@app/components';
import { useAccountBalanceService, useBalanceTransfer } from '@app/api';
import { NetworkType, StageStatus } from '@app/types';

import { SendFundsModal } from './SendFundsModal';

export interface SendFundsProps {
  isVisible: boolean;
  networkType?: NetworkType;
  senderAccount?: Account;
  onClose: () => void;
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
  const { onClose, senderAccount } = props;

  const { error, info } = useNotifications();
  const { stage, fee, calculateFee, signTransferAndSubmit } = useBalanceTransfer();

  const amountChangeHandler = useCallback(
    (senderAddress: string, destinationAddress: string, amount: number) => {
      calculateFee({ address: senderAddress, destination: destinationAddress, amount });
    },
    [],
  );
  const confirmHandler = useCallback(
    (senderAddress: string, destinationAddress: string, amount: number) => {
      signTransferAndSubmit({
        address: senderAddress,
        destination: destinationAddress,
        amount,
      });
    },
    [],
  );

  useEffect(() => {
    if (stage.status === StageStatus.success) {
      info(stage.title);

      onClose();
    } else if (stage.status === StageStatus.error) {
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
