import { useAccounts, useApi } from '@app/hooks';
import { ButtonProps } from '@app/components';
import { BaseActionBtn } from '@app/components/ActionBtn/BaseActionBtn';

export const TransferBtn = (props: ButtonProps & { tooltip?: string | null }) => {
  const { currentChain } = useApi();
  const { selectedAccount } = useAccounts();
  return (
    <BaseActionBtn
      {...props}
      actionEnabled={
        Boolean(selectedAccount?.isMintingEnabled) && currentChain.transfersEnabled
      }
      actionText="Transfer temporary unavailable due to a chain upgrade"
    />
  );
};
