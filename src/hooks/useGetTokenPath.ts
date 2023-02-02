import { Address } from '@unique-nft/utils';

import { useApi } from '@app/hooks';

export const useGetTokenPath = () => {
  const { currentChain } = useApi();

  return (address?: string, collectionId?: number, tokenId?: number) => {
    if (!address || !collectionId || !tokenId) {
      return '';
    }
    const ownerAddress =
      Address.is.nestingAddress(address) || Address.is.ethereumAddress(address)
        ? address
        : Address.mirror.substrateToEthereum(address);

    return `/${currentChain?.network}/token/${ownerAddress}/${collectionId}/${tokenId}`;
  };
};
