import { useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useCalculateFee } from '@app/api';
import { BalanceResponse, UnsignedTxPayloadResponse } from '@app/types/Api';

export interface UseFeeResult {
  fee: string;
  getFee: (extrinsic: UnsignedTxPayloadResponse) => Promise<void>;
}

export const useFee = (): UseFeeResult => {
  const { calculateFee } = useCalculateFee();
  const { error } = useNotifications();
  const [fee, setFee] = useState<string>('');

  const getFee = async (unsignedTx: UnsignedTxPayloadResponse) => {
    const result = await calculateFee(unsignedTx);

    if (!result) {
      error('Calculate fee error', {
        name: 'Calculate fee',
        size: 32,
        color: 'white',
      });
    }

    const { amount, unit } = result as BalanceResponse;

    setFee([amount.replace(/([0]+)$/, ''), unit].join(' '));
  };

  return {
    getFee,
    fee,
  };
};
