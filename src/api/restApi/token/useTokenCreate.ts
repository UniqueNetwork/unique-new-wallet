import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { useMetamaskTokenCreate } from '@app/hooks/useMetamask/useMetamaskTokenCreate';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

export const useTokenCreate = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.tokens.create);
  const metamaskTokensTransfer = useMetamaskTokenCreate();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
