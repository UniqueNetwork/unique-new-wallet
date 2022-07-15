import React, { FC, useEffect, VFC } from 'react';
import { Modal, useNotifications } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import { Account } from '@app/account';
import { Stages } from '@app/components';
import { Chain, NetworkType, StageStatus } from '@app/types';
import { AccountApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';

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
  const { error, info } = useNotifications();

  const { isFlowLoading, flowError, flowStatus, signAndSubmitExtrinsic } =
    useExtrinsicFlow(AccountApiService.balanceTransfer);
  const { isFeeError, feeError, feeFormatted, getFee } = useExtrinsicFee(
    AccountApiService.balanceTransfer,
  );

  useEffect(() => {
    setCurrentChain(chain);
  }, [chain, setCurrentChain]);

  const amountChangeHandler = (
    senderAddress: string,
    destinationAddress: string,
    amount: number,
  ) => {
    getFee({
      balanceTransfer: {
        address: senderAddress,
        destination: destinationAddress,
        amount,
      },
    });
  };

  useEffect(() => {
    if (flowStatus === 'success') {
      info('Transfer completed successfully');
      onSendSuccess?.();
      onClose();
    } else if (flowStatus === 'error') {
      error(flowError?.message);
    }
  }, [flowStatus]);

  useEffect(() => {
    if (isFeeError) {
      error(feeError?.message);
    }
  }, [isFeeError]);

  const confirmHandler = (
    senderAddress: string,
    destinationAddress: string,
    amount: number,
  ) => {
    signAndSubmitExtrinsic({
      balanceTransfer: {
        address: senderAddress,
        destination: destinationAddress,
        amount,
      },
    });
  };

  return (
    <>
      {isFlowLoading ? (
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
