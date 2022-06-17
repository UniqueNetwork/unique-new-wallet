import { FileService } from '@app/api/FileApi/FileService';
import { BaseApi, useApiMutation } from '@app/api';
import config from '@app/config';

export const useFileUpload = () => {
  const api = new BaseApi(config?.imageServerUrl ?? '');

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
