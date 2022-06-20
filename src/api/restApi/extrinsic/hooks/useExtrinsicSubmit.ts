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

    return submitMutation.mutateAsync({
      api,
      extrinsic,
    });
  };

  return {
    submitExtrinsic,
  };
};
