import { useMutation } from 'react-query';

import { useApi } from '@app/hooks';

export const useFileUpload = () => {
  const { api } = useApi();

  const uploadFile = (file: Blob) => {
    return api.ipfs.uploadFile({ file });
  };

  const uploadFileMutation = useMutation(uploadFile);

  return {
    uploadFile: uploadFileMutation.mutateAsync,
    isLoading: uploadFileMutation.isLoading,
  };
};
