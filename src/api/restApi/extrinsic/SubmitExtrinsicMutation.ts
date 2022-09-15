import { QueryClient } from 'react-query';

import { EndpointMutation } from '@app/api/restApi/request';
import { IBaseApi } from '@app/api';
import { SubmitExtrinsicResult, SubmittableExtrinsicDTO } from '@app/types';

export type SubmitExtrinsicMutationPayload = {
  api: IBaseApi;
  payload: SubmittableExtrinsicDTO;
};

export class SubmitExtrinsicMutation extends EndpointMutation<
  SubmitExtrinsicResult,
  SubmitExtrinsicMutationPayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/extrinsic/submit';

    this.request = this.request.bind(this);
  }

  async request({
    api,
    payload,
  }: SubmitExtrinsicMutationPayload): Promise<SubmitExtrinsicResult> {
    return api.post<SubmitExtrinsicResult, SubmittableExtrinsicDTO>(
      this.baseUrl,
      payload,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: SubmitExtrinsicResult,
    payload: SubmitExtrinsicMutationPayload,
  ) {
    // TODO - add notification here
  }
}
