import { NFTToken, Nullable } from '@app/types';

export const useRestApi = () => {
  const getToken = async (collectionId: number, tokenId: number): Promise<Nullable<NFTToken>> => {
    return null;
  };

  return {
    getToken,
  };
};
