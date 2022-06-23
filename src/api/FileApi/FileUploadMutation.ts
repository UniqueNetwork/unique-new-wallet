import { QueryClient } from 'react-query';

import { IBaseApi } from '@app/api';

import { EndpointMutation } from '../restApi/request';

export interface FileUploadMutationPayload {
  api: IBaseApi;
  file: Blob;
}

export interface FileUploadMutationResponse {
  address: string;
  success: boolean;
}

export class FileUploadMutation extends EndpointMutation<
  FileUploadMutationResponse,
  FileUploadMutationPayload
> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = `/api/images/upload`;

    this.request = this.request.bind(this);
  }

  async request(payload: FileUploadMutationPayload): Promise<FileUploadMutationResponse> {
    const formData = new FormData();
    formData.append('file', payload.file, 'nftImage');

    return payload.api.post<FileUploadMutationResponse, FormData>(
      `${this.baseUrl}`,
      formData,
    );
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: FileUploadMutationResponse,
    payload: FileUploadMutationPayload,
  ) {
    // TODO - add notification here
  }
}
