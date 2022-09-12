import { useCallback } from 'react';

import { useApi } from '@app/hooks';
import { useApiMutation } from '@app/api';

import { FileService } from '../FileService';

export const useFileUpload = () => {
  const { api } = useApi();

  const fileUpload = useApiMutation({
    endpoint: FileService.fileUpload,
  });

  const uploadFile = useCallback(async (file: Blob) => {
    if (!api) {
      return;
    }

    return fileUpload.mutateAsync({
      api,
      payload: file,
    });
  }, []);

  return {
    uploadFile,
    isLoading: fileUpload.isLoading,
  };
};
