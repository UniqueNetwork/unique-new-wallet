import { Address } from '@unique-nft/utils';

import { useApi } from '@app/hooks';

export const useGetTokenPath = () => {
  const { currentChain } = useApi();

  return (address?: string, collectionId?: number, tokenId?: number) => {
    if (!address || !collectionId || !tokenId) {
      return '';
    }

    return `/${currentChain?.network}/token/${address}/${collectionId}/${tokenId}`;
  };
};
