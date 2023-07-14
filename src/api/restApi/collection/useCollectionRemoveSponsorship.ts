import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { useMetamaskCollectionRemoveSponsorship } from '@app/hooks/useMetamask/useMetamaskCollectionRemoveSponsorship';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

export const useCollectionRemoveSponsorship = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.removeSponsorship);
  const metamaskTokensTransfer = useMetamaskCollectionRemoveSponsorship();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
