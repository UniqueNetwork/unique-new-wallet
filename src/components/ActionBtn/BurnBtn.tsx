import { useAccounts, useApi } from '@app/hooks';
import { BaseActionBtn } from '@app/components/ActionBtn/BaseActionBtn';

import { ButtonProps } from '../Button';

export const BurnBtn = (props: ButtonProps) => {
  const { currentChain } = useApi();
  const { selectedAccount } = useAccounts();
  return (
    <BaseActionBtn
      {...props}
      actionEnabled={
        Boolean(selectedAccount?.isMintingEnabled) && currentChain.mintingEnabled
      }
      actionText="Burn token temporary unavailable due to a chain upgrade"
    />
  );
};
