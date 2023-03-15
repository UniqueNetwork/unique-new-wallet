import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useExtrinsicMutation } from '@app/api';
import { useAccounts, useApi } from '@app/hooks';
import { useMetamaskTransferRefungibleToken } from '@app/hooks/useMetamask/useMetamaskTransferRefungibleToken';

export const useTokenRefungibleTransfer = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.refungible.transferToken);
  const metamaskTokensTransfer = useMetamaskTransferRefungibleToken();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }

  return defaultTokensTransfer;
};
