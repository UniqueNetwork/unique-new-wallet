import { QueryClient } from 'react-query';

import { IBaseApi } from '@app/api';

import { EndpointMutation } from '../restApi/request';

export interface FileUploadMutationPayload {
  api: IBaseApi;
  payload: Blob;
}

export interface FileUploadMutationResponse {
  cid: string;
  fileUrl: string;
}

export class FileUploadMutation extends EndpointMutation<
  FileUploadMutationResponse,
  FileUploadMutationPayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = `/ipfs/upload-file`;

    this.request = this.request.bind(this);
  }

  async request({
    api,
    payload,
  }: FileUploadMutationPayload): Promise<FileUploadMutationResponse> {
    const formData = new FormData();
    formData.append('file', payload, 'nftImage');

    return api.post<FileUploadMutationResponse, FormData>(`${this.baseUrl}`, formData);
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: FileUploadMutationResponse,
    payload: FileUploadMutationPayload,
  ) {
    // TODO - add notification here
  }
}
