import { BN, hexToBigInt } from '@polkadot/util';
import { useCallback, useState } from 'react';
import { FeeResponse } from '@unique-nft/sdk';
import { UseMutateAsyncFunction } from 'react-query';

import { formatKusamaBalance, truncateDecimalsBalanceSheet } from '@app/utils';
import { MetamaskDefaultDecimals } from '@app/account/MetamaskWallet';

export const useMetamaskFee = <P>(estimateGasMethod: (params: P) => Promise<BN>) => {
  const [fee, setFee] = useState<string>();
  const [gas, setGas] = useState<BN>();
  const [gasPrice, setGasPrice] = useState<BN>();
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeStatus, setFeeStatus] = useState<'success' | 'error' | 'loading' | 'idle'>(
    'idle',
  );
  const [feeLoading, setFeeLoading] = useState(false);

  const getFee: UseMutateAsyncFunction<
    { fee: FeeResponse | undefined } | undefined,
    Error,
    P,
    unknown
  > = useCallback(
    async (params: P) => {
      setFeeLoading(true);
      const { request } = (window as any).ethereum;
      try {
        const gasPrice = await request({
          method: 'eth_gasPrice',
        });

        setGasPrice(new BN(gasPrice.slice(2), 'hex'));

        const estimateGas = await estimateGasMethod(params);

        setGas(estimateGas);

        const amount = truncateDecimalsBalanceSheet(
          formatKusamaBalance(
            estimateGas.mul(new BN(hexToBigInt(gasPrice).toString())).toString(),
            MetamaskDefaultDecimals,
          ),
        );

        const fee: FeeResponse = {
          raw: estimateGas.toString(),
          amount,
          formatted: amount,
          unit: '',
          decimals: MetamaskDefaultDecimals,
        };

        setFee(fee.amount);
        setFeeStatus('success');
        return { fee };
      } catch (error: any) {
        setFeeError(error);
        setFeeStatus('error');
      } finally {
        setFeeLoading(false);
      }
    },
    [estimateGasMethod],
  );

  return {
    fee,
    feeFormatted: fee,
    getFee,
    gas,
    gasPrice,
    feeStatus,
    feeLoading,
    feeError,
  };
};
