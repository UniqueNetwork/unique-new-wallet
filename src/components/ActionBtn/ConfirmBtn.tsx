import { useAccounts, useApi } from '@app/hooks';
import { BaseActionBtn } from '@app/components/ActionBtn/BaseActionBtn';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

import { ButtonProps } from '../Button';

export const ConfirmBtn = (props: ButtonProps & { tooltip?: string | null }) => {
  const { currentChain } = useApi();
  const { selectedAccount } = useAccounts();
  return (
    <BaseActionBtn
      {...props}
      actionEnabled={
        Boolean(selectedAccount?.isMintingEnabled) && currentChain.mintingEnabled
      }
      actionText={
        selectedAccount?.name === MetamaskAccountName
          ? null
          : 'Minting temporary unavailable due to a chain upgrade'
      }
    />
  );
};
