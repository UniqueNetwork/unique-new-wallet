import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useMetamaskCollectionSetTokenPropertyPermissions } from '@app/hooks/useMetamask/useMetamaskCollectionSetTokenPropertyPermissions';

export const useCollectionSetTokenPropertyPermissions = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(
    api.collections.setPropertyPermissions,
  );
  const metamaskTokensTransfer = useMetamaskCollectionSetTokenPropertyPermissions();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
