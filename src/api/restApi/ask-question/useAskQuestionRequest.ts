import { useMutation } from 'react-query';

import { BaseApi } from '@app/api';
import { config } from '@app/config';

export type AskQuestionRequestType = {
  name: string;
  email: string;
  question: string;
};

export const useAskQuestionRequest = () => {
  const api = new BaseApi(config.zendeskApi!);

  const createQuestionApi = ({ question, email, name }: AskQuestionRequestType) => {
    return api.post(
      '/tickets',
      {
        ticket: {
          comment: {
            body: 'From Unique Wallet',
          },
          priority: 'urgent',
          subject: `Name: ${name}, Email: ${email}, Question: ${question}.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${config.zenDeskToken}`,
        },
      },
    );
  };

  const createMutation = useMutation(createQuestionApi);

  const createAskQuestionRequest = async (data: AskQuestionRequestType) => {
    return createMutation.mutateAsync(data);
  };

  return {
    createAskQuestionRequest,
    isLoadingRequestQuestion: createMutation.isLoading,
  };
};
