import { BaseApi, useApiMutation } from '@app/api';
import { AskQuestionApiService } from '@app/api/restApi/ask-question/AskQuestionApiService';
import { AskQuestionRequestType } from '@app/api/restApi/ask-question/index';

export const useAskQuestionRequest = () => {
  const api = new BaseApi('');

  const createMutation = useApiMutation({
    endpoint: AskQuestionApiService.askQuestionService,
  });

  const createAskQuestionRequest = async (data: AskQuestionRequestType) => {
    return createMutation.mutateAsync({
      api,
      payload: data,
    });
  };

  return {
    createAskQuestionRequest,
    isLoadingRequestQuestion: createMutation.isLoading,
  };
};
