import React, { FC, useEffect, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { Account } from '@app/account';
import { Stages } from '@app/components';
import { Chain, NetworkType, StageStatus } from '@app/types';
import { useAccountBalanceTransfer } from '@app/api';
import { Modal } from '@app/components/Modal';

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
    <Modal isVisible isClosable={false} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};

export const SendFunds: FC<SendFundsProps> = (props) => {
  const { onClose, senderAccount, onSendSuccess, chain } = props;

  const { setCurrentChain } = useApi();
  const { info, error } = useNotifications();

  const {
    getFee,
    feeFormatted,
    isLoadingSubmitResult,
    submitWaitResult,
    feeError,
    submitWaitResultError,
  } = useAccountBalanceTransfer();

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

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
    })
      .then(() => {
        info('Transfer completed successfully');
        onSendSuccess?.();
        onClose();
      })
      .catch(() => {
        submitWaitResultError && error(submitWaitResultError);
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
