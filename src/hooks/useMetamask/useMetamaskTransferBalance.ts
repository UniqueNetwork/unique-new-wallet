import { BN } from '@polkadot/util';
import { Address } from '@unique-nft/utils';
import { useState } from 'react';

import { BalanceTransferBody } from '@app/types/Api';

import { useMetamaskFee } from './useMetamaskFee';

export const useMetamaskBalanceTransfer = () => {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);

  const feeResult = useMetamaskFee();

  const submitWaitResult = ({ payload }: { payload: BalanceTransferBody }) => {
    setIsLoadingSubmitResult(true);

    const { request } = (window as any).ethereum;

    return request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: payload.address,
          to: Address.is.ethereumAddress(payload.destination)
            ? payload.destination
            : Address.mirror.substrateToEthereum(payload.destination),
          value:
            '0x' + new BN(payload.amount).mul(new BN(10).pow(new BN(18))).toString('hex'),
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
