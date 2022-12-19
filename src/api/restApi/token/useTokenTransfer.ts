import { useExtrinsicMutation } from '@app/api';
import { useAccounts, useApi } from '@app/hooks';
import { useMetamaskTransferToken } from '@app/hooks/useMetamask/useMetamaskTransferToken';

export const useTokenTransfer = () => {
  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const defaultTokensTransfer = useExtrinsicMutation(api.tokens.transfer);
  const metamaskTokensTransfer = useMetamaskTransferToken();

  if (selectedAccount?.name === 'Metamask Account') {
    return metamaskTokensTransfer;
  }
  return defaultTokensTransfer;
};
