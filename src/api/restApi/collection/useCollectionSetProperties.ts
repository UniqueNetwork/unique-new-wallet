import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useMetamaskCollectionSetProperties } from '@app/hooks/useMetamask/useMetamaskCollectionSetProperties';

export const useCollectionSetProperties = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.setProperties);
  const metamaskTokensTransfer = useMetamaskCollectionSetProperties();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
