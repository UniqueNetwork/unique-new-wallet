import { BN } from '@polkadot/util';
import { Address } from '@unique-nft/utils';
import { useState } from 'react';

import { BalanceTransferBody } from '@app/types/Api';
import { MetamaskDefaultDecimals } from '@app/account/MetamaskWallet';
import { repeatCheckForTransactionFinish } from '@app/api/restApi/balance/utils';

import { useMetamaskFee } from './useMetamaskFee';
import { amountToBnHex } from './utils';
import { useApi } from '../useApi';

const { request } = (window as any).ethereum || {};

export const useMetamaskBalanceTransfer = () => {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);
  const { api } = useApi();

  const { gas, gasPrice, ...feeResult } = useMetamaskFee<BalanceTransferBody>(
    async ({ address, destination, amount }) => {
      const estimateGas = await request?.({
        method: 'eth_estimateGas',
        params: [
          {
            from: address,
            to: Address.is.ethereumAddress(destination)
              ? destination
              : Address.mirror.substrateToEthereum(destination),
            value: amountToBnHex(amount.toString(), MetamaskDefaultDecimals),
          },
        ],
      });
      return new BN(estimateGas.slice(2), 'hex');
    },
  );

  const submitWaitResult = async ({ payload }: { payload: BalanceTransferBody }) => {
    setIsLoadingSubmitResult(true);

    const balance = await api.balance.get({ address: payload.address });

    try {
      const result = await request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: payload.address,
            to: Address.is.ethereumAddress(payload.destination)
              ? payload.destination
              : Address.mirror.substrateToEthereum(payload.destination),
            value: amountToBnHex(payload.amount.toString(), MetamaskDefaultDecimals),
            gas: gas?.toString('hex'),
          },
        ],
      });
      await repeatCheckForTransactionFinish(async () => {
        const newBalance = await api.balance.get({ address: payload.address });
        return balance.availableBalance?.amount !== newBalance.availableBalance?.amount;
      });

      setIsLoadingSubmitResult(false);
      return result;
    } catch (error: any) {
      setSubmitWaitResultError(error.message);
      setIsLoadingSubmitResult(false);
      throw error;
    }
  };

  return {
    submitWaitResult,
    isLoadingSubmitResult,
    submitWaitResultError,
    ...feeResult,
  };
};
