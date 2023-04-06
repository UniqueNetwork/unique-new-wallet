import React, { FC, useEffect } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils';

import { useApi } from '@app/hooks';
import { Account } from '@app/account';
import { Stages, Modal } from '@app/components';
import { Chain, StageStatus } from '@app/types';
import { useAccountBalanceWithdraw } from '@app/api';

export interface WithdrawProps {
  isVisible: boolean;
  senderAccount: Account;
  onClose: () => void;
  onWithdrawSuccess?(): void;
  chain: Chain;
  amount: string;
}

const stages = [
  {
    title: 'Withdraw in progress',
    status: StageStatus.inProgress,
  },
];

export const WithdrawModal: FC<WithdrawProps> = ({
  senderAccount,
  amount,
  onClose,
  onWithdrawSuccess,
  chain,
}) => {
  const { setCurrentChain } = useApi();
  const { info, error } = useNotifications();

  const { submitWaitResult, submitWaitResultError } = useAccountBalanceWithdraw({
    senderAccount,
  });

  useEffect(() => {
    setCurrentChain(chain);
  }, [chain, setCurrentChain]);

  useEffect(() => {
    if (!submitWaitResultError) {
      return;
    }
    error(submitWaitResultError);
  }, [submitWaitResultError]);

  useEffect(() => {
    (async () => {
      try {
        await submitWaitResult({
          address: senderAccount.address,
          amount,
        });
        info('Transfer completed successfully');
        onWithdrawSuccess?.();
        onClose();
      } catch (e) {
        error('Something went wrong');

        onClose();
      }
    })();
  }, []);

  return (
    <Modal isVisible isClosable={false} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};
