import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { useMetamaskBurnCollection } from '@app/hooks/useMetamask/useMetamaskBurnCollection';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

export const useCollectionBurn = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.destroy);
  const metamaskTokensTransfer = useMetamaskBurnCollection();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
