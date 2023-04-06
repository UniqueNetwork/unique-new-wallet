import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useMetamaskNestToken } from '@app/hooks/useMetamask/useMetamaskNestToken';

export const useTokenNest = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensNest = useExtrinsicMutation(api.tokens.nest);
  const metamaskTokensNest = useMetamaskNestToken();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensNest;
  }

  return defaultTokensNest;
};
