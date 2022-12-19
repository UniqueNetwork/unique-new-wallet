import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api/restApi/hooks';
import { Account } from '@app/account';
import { useMetamaskBalanceTransfer } from '@app/hooks/useMetamask/useMetamaskTransferBalance';

export const useAccountBalanceTransfer = ({
  senderAccount,
}: {
  senderAccount: Account;
}) => {
  const { api } = useApi();

  const defaultBalanceTransfer = useExtrinsicMutation(api.balance.transfer);
  const metamaskBalanceTransfer = useMetamaskBalanceTransfer();

  if (senderAccount.name === 'Metamask Account') {
    return metamaskBalanceTransfer;
  }
  return defaultBalanceTransfer;
};
