import { FeeResponse, IMutation } from '@unique-nft/sdk';
import { useMutation } from 'react-query';

import { truncateDecimalsBalanceSheet } from '@app/utils';
import { UNKNOWN_ERROR_MSG } from '@app/api/restApi/hooks/constants';

export const useExtrinsicFee = <T, R>(getFeeEndpoint: IMutation<T, R>['getFee']) => {
  const getFee = (data: T) => getFeeEndpoint(data);

  const feeMutationQueryResult = useMutation<FeeResponse, Error, T>(getFee);

  return {
    fee: feeMutationQueryResult.data?.amount || '',
    feeFormatted: feeMutationQueryResult.data
      ? [
          truncateDecimalsBalanceSheet(feeMutationQueryResult.data.amount),
          feeMutationQueryResult.data.unit,
        ].join(' ')
      : '',
    getFee: feeMutationQueryResult.mutateAsync,
    feeStatus: feeMutationQueryResult.status,
    feeLoading: feeMutationQueryResult.isLoading,
    feeError: feeMutationQueryResult.isError
      ? feeMutationQueryResult.error?.message || UNKNOWN_ERROR_MSG
      : null,
  };
};
