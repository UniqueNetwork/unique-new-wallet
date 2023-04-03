import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useMetamaskBurnToken } from '@app/hooks/useMetamask/useMetamaskBurnToken';

export const useTokenBurn = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensNest = useExtrinsicMutation(api.tokens.burn);
  const metamaskTokensNest = useMetamaskBurnToken();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensNest;
  }

  return defaultTokensNest;
};
