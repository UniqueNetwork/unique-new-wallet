import { useApiMutation } from '@app/api';
import { SubmittableExtrinsicDTO } from '@app/types';
import { useApi } from '@app/hooks';

import { ExtrinsicApiService } from '../ExtrinsicApiService';

export const useExtrinsicSubmit = () => {
  const { api } = useApi();

  const submitMutation = useApiMutation({
    endpoint: ExtrinsicApiService.submitExtrinsic,
  });

  const submitExtrinsic = async (extrinsic: SubmittableExtrinsicDTO) => {
    if (!api) {
      // TODO - notify user
      return;
    }

    const response = await submitMutation.mutateAsync({
      api,
      extrinsic,
    });

    console.log('submitExtrinsic response', response);

    return response;
  };

  return {
    submitExtrinsic,
  };
};
