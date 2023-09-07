import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useMetamaskCollectionConfirmSponsorship } from '@app/hooks/useMetamask/useMetamaskCollectionConfirmSponsorship';

export const useCollectionConfirmSponsorship = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.collections.confirmSponsorship);
  const metamaskTokensTransfer = useMetamaskCollectionConfirmSponsorship();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
