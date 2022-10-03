import React, { FC, useEffect, VFC } from 'react';
import { Modal, useNotifications } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { Account } from '@app/account';
import { Stages } from '@app/components';
import { Chain, NetworkType, StageStatus } from '@app/types';
import { useAccountBalanceTransfer } from '@app/api';

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

  const { setCurrentChain } = useApi();
  const { info } = useNotifications();

  const { getFee, feeFormatted, isLoadingSubmitResult, submitWaitResult } =
    useAccountBalanceTransfer();

  useEffect(() => {
    setCurrentChain(chain);
  }, [chain, setCurrentChain]);

  const amountChangeHandler = (
    senderAddress: string,
    destinationAddress: string,
    amount: number,
  ) => {
    getFee({
      address: senderAddress,
      destination: destinationAddress,
      amount,
    });
  };

  const confirmHandler = (
    senderAddress: string,
    destinationAddress: string,
    amount: number,
  ) => {
    submitWaitResult({
      payload: {
        address: senderAddress,
        destination: destinationAddress,
        amount,
      },
      senderAddress,
    }).then(() => {
      info('Transfer completed successfully');
      onSendSuccess?.();
      onClose();
    });
  };

  return (
    <>
      {isLoadingSubmitResult ? (
        <TransferStagesModal />
      ) : (
        <SendFundsModal
          {...props}
          fee={feeFormatted}
          senderAccount={senderAccount}
          onConfirm={confirmHandler}
          onAmountChange={amountChangeHandler}
        />
      )}
    </>
  );
};
