import { useApiMutation, ExtrinsicApiService } from '@app/api';
import { Balance } from '@app/types';
import { useApi } from '@app/hooks';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

export const useCalculateFee = () => {
  const { api } = useApi();

  const calculateFeeMutation = useApiMutation({
    endpoint: ExtrinsicApiService.calculateFee,
  });

  const calculateFee = async (
    extrinsic: UnsignedTxPayloadResponse,
  ): Promise<Balance | undefined> => {
    if (!api) {
      return;
    }

    return calculateFeeMutation.mutateAsync({
      api,
      extrinsic,
    });
  };

  return {
    calculateFee,
  };
};
