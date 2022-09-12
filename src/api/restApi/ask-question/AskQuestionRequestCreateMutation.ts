import { IBaseApi } from '@app/api';
import { EndpointMutation } from '@app/api/restApi/request';
import { config } from '@app/config';

export type AskQuestionRequestType = {
  name: string;
  email: string;
  question: string;
};

export type AskQuestionCreatePayload = {
  api: IBaseApi;
  payload: AskQuestionRequestType;
};

type AskQuestionCreatePayloadRequest = {
  ticket: {
    comment: {
      body: string;
    };
    priority: string;
    subject: string;
  };
};

export class AskQuestionRequestCreateMutation extends EndpointMutation<
  unknown,
  AskQuestionCreatePayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = 'https://uniquenetwork.zendesk.com/api/v2';

    this.request = this.request.bind(this);
  }

  async request({
    api,
    payload: { question, email, name },
  }: AskQuestionCreatePayload): Promise<unknown> {
    return api.post<any, AskQuestionCreatePayloadRequest>(
      `${this.baseUrl}/tickets`,
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
  }
}
