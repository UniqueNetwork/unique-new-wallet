import React, { useMemo, VFC } from 'react';
import styled from 'styled-components';

import { Modal } from '@app/components/Modal';
import { BaseActionBtn } from '@app/components';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { useAccounts } from '@app/hooks';

import { Typography } from '../../../../components/Typography';
import { NOT_ENOUGH_BALANCE_MESSAGE } from '../constants';

interface AskBurnModalProps {
  fee: string;
  isVisible: boolean;
  isSufficientBalance: boolean;
  onBurn(): void;
  onClose(): void;
  isLoading: boolean;
}

export const AskBurnModal: VFC<AskBurnModalProps> = ({
  fee,
  isVisible,
  isSufficientBalance,
  onBurn,
  onClose,
  isLoading,
}) => {
  const { selectedAccount } = useAccounts();

  const validationMessage = useMemo(() => {
    if (!isSufficientBalance) {
      return `${NOT_ENOUGH_BALANCE_MESSAGE} ${selectedAccount?.unitBalance || 'coins'}`;
    }
    return null;
  }, [isSufficientBalance, selectedAccount]);

  return (
    <Modal
      isClosable
      footerButtons={[
        <BaseActionBtn
          title="Confirm"
          disabled={!isSufficientBalance}
          role="primary"
          actionEnabled={isSufficientBalance}
          actionText={validationMessage || ''}
          tooltip={validationMessage}
          onClick={onBurn}
        />,
      ]}
      isVisible={isVisible}
      title="Burn token"
      onClose={onClose}
    >
      <TextWrapper size="m" appearance="block">
        You will not be able to undo this action.
      </TextWrapper>
      <FeeInformationTransaction fee={fee} feeLoading={isLoading} />
    </Modal>
  );
};

const TextWrapper = styled(Typography)`
  margin-bottom: calc(var(--prop-gap));
`;
