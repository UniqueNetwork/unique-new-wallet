import { useState } from 'react';

import { BaseApi, useApiMutation } from '@app/api';
import config from '@app/config';

import { FileService } from '../FileService';

export const useFileUpload = () => {
  const [api] = useState(() => new BaseApi(config?.imageServerUrl ?? ''));

  const fileUpload = useApiMutation({
    endpoint: FileService.fileUpload,
  });

  const uploadFile = async (file: Blob) =>
    fileUpload.mutateAsync({
      api,
      file,
    });

  return {
    uploadFile,
  };
};
