import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { useMetamaskCollectionSetLimits } from '@app/hooks/useMetamask/useMetamaskCollectionSetLimits';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

export const useCollectionSetLimits = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.setLimits);
  const metamaskTokensTransfer = useMetamaskCollectionSetLimits();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
