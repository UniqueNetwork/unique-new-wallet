import { BN } from '@polkadot/util';
import { Address } from '@unique-nft/utils';
import { useState } from 'react';

import { BalanceTransferBody } from '@app/types/Api';
import { MetamaskDefaultDecimals } from '@app/account/MetamaskWallet';

import { useMetamaskFee } from './useMetamaskFee';
import { amountToBnString } from './utils';

const { request } = (window as any).ethereum || {};

export const useMetamaskBalanceTransfer = () => {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);

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
            value:
              '0x' +
              new BN(
                amountToBnString(amount.toString(), MetamaskDefaultDecimals),
              ).toString('hex'),
          },
        ],
      });
      return new BN(estimateGas.slice(2), 'hex');
    },
  );

  const submitWaitResult = ({ payload }: { payload: BalanceTransferBody }) => {
    setIsLoadingSubmitResult(true);

    return request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: payload.address,
          to: Address.is.ethereumAddress(payload.destination)
            ? payload.destination
            : Address.mirror.substrateToEthereum(payload.destination),
          value:
            '0x' +
            new BN(
              amountToBnString(payload.amount.toString(), MetamaskDefaultDecimals),
            ).toString('hex'),
          gas: gas?.toString('hex'),
        },
      ],
    })
      .then(() => {
        setIsLoadingSubmitResult(false);
      })
      .catch((error: any) => {
        setSubmitWaitResultError(error.message);
        setIsLoadingSubmitResult(false);
        throw error;
      });
  };

  return {
    submitWaitResult,
    isLoadingSubmitResult,
    submitWaitResultError,
    ...feeResult,
  };
};
