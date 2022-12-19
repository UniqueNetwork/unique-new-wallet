import { useAccounts, useApi } from '@app/hooks';
import { ButtonProps } from '@app/components';
import { BaseActionBtn } from '@app/components/ActionBtn/BaseActionBtn';

export const TransferBtn = (props: ButtonProps) => {
  const { currentChain } = useApi();
  const { selectedAccount } = useAccounts();
  return (
    <BaseActionBtn
      {...props}
      actionEnabled={currentChain.transfersEnabled}
      actionText="Transfer temporary unavailable due to a chain upgrade"
    />
  );
};
