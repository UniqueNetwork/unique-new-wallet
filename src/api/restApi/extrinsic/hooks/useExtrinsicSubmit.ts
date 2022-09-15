import { useApiMutation, ExtrinsicApiService } from '@app/api';
import { SubmitExtrinsicResult, SubmittableExtrinsicDTO } from '@app/types';
import { useApi } from '@app/hooks';

export const useExtrinsicSubmit = () => {
  const { api } = useApi();

  const submitMutation = useApiMutation({
    endpoint: ExtrinsicApiService.submitExtrinsic,
  });

  const submitExtrinsic = async (
    extrinsic: SubmittableExtrinsicDTO,
  ): Promise<SubmitExtrinsicResult | void> => {
    if (!api) {
      // TODO - notify user
      return;
    }

    return submitMutation.mutateAsync({
      api,
      payload: extrinsic,
    });
  };

  return {
    submitExtrinsic,
  };
};
