import { useApiMutation, ExtrinsicApiService } from '@app/api';
import { useApi } from '@app/hooks';
import { BalanceResponse, UnsignedTxPayloadResponse } from '@app/types/Api';

export const useCalculateFee = () => {
  const { api } = useApi();

  const calculateFeeMutation = useApiMutation({
    endpoint: ExtrinsicApiService.calculateFee,
  });

  const calculateFee = async (
    extrinsic: UnsignedTxPayloadResponse,
  ): Promise<BalanceResponse | undefined> => {
    if (!api) {
      return;
    }

    return calculateFeeMutation.mutateAsync({
      api,
      payload: extrinsic,
    });
  };

  return {
    calculateFee,
  };
};
