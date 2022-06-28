import { useState } from 'react';

import { useExtrinsicStatus } from '@app/api/restApi/extrinsic/hooks/useExtrinsicStatus';

export const useTxStatusCheck = () => {
  const [txHash, setTxHash] = useState<string>();
  const { data: extrinsicStatus } = useExtrinsicStatus(txHash);

  const checkTxStatus = (externalTx: string) => {
    if (externalTx) {
      setTxHash(txHash);
    }
  };

  return {
    checkTxStatus,
    isCompleted: extrinsicStatus?.isCompleted,
    isError: extrinsicStatus?.isError,
    errorMessage: extrinsicStatus?.errorMessage,
  };
};
