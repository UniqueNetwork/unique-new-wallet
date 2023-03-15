import { MetamaskAccountName } from '@app/account/MetamaskWallet';
import { useExtrinsicMutation } from '@app/api';
import { useAccounts, useApi } from '@app/hooks';
import { useMetamaskUnnestToken } from '@app/hooks/useMetamask/useMetamaskUnnestToken';

export const useTokenUnnest = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensUnnest = useExtrinsicMutation(api.tokens.unnest);
  const metamaskTokensUnnest = useMetamaskUnnestToken();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensUnnest;
  }

  return defaultTokensUnnest;
};
