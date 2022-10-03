import { IMutation } from '@unique-nft/sdk';

import { useExtrinsicFee, useExtrinsicFlow } from '@app/api';

export const useExtrinsicMutation = <A, R>(mutation: IMutation<A, R>) => {
  const feeResult = useExtrinsicFee(mutation.getFee.bind(mutation));

  const submitResult = useExtrinsicFlow(mutation);

  return {
    ...feeResult,
    ...submitResult,
  };
};
