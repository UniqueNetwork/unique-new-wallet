import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { useMetamaskCollectionSetSponsor } from '@app/hooks/useMetamask/useMetamaskCollectionSetSponsor';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

export const useCollectionSetSponsor = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.setSponsorship);
  const metamaskTokensTransfer = useMetamaskCollectionSetSponsor();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
