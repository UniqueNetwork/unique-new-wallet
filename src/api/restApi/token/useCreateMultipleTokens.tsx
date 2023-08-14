import { useAccounts, useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';
import { useMetamaskCreateMultipleTokens } from '@app/hooks/useMetamask/useCreateMultipleTokens';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

export const useCreateMultipleTokens = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensCreate = useExtrinsicMutation(api.tokens.createMultiple);
  const metamaskTokensCreate = useMetamaskCreateMultipleTokens();

  if (selectedAccount?.name === MetamaskAccountName) {
    return metamaskTokensCreate;
  }
  return defaultTokensCreate;
};
