import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useMetamaskCollectionCreate } from '@app/hooks/useMetamask/useMetamaskCollectionCreate';

export const useCollectionCreate = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.create);
  const metamaskTokensTransfer = useMetamaskCollectionCreate();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
