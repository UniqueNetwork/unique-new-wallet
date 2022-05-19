import { NFTToken, Nullable } from '@app/types';

export const useRestApi = () => {
  const getToken = async (
    collectionId: number,
    tokenId: number,
    // eslint-disable-next-line @typescript-eslint/require-await
  ): Promise<Nullable<NFTToken>> => {
    return null;
  };

  return {
    getToken,
  };
};
