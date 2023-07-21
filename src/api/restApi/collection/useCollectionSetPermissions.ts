import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { useMetamaskCollectionSetPermissions } from '@app/hooks/useMetamask/useMetamaskCollectionSetPermissions';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

export const useCollectionSetPermissions = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.setPermissions);
  const metamaskTokensTransfer = useMetamaskCollectionSetPermissions();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
