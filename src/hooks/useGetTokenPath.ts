import { Address } from '@unique-nft/utils';
import { useContext } from 'react';

import { useApi } from '@app/hooks';
import { ChainPropertiesContext } from '@app/context';

export const useGetTokenPath = () => {
  const { currentChain } = useApi();
  const { chainProperties } = useContext(ChainPropertiesContext);

  return (address?: string, collectionId?: number, tokenId?: number) => {
    if (!address || !collectionId || !tokenId) {
      return '';
    }

    const normalizedAddress = Address.is.substrateAddress(address)
      ? Address.normalize.substrateAddress(address, chainProperties.SS58Prefix)
      : address;

    return `/${currentChain?.network}/token/${normalizedAddress}/${collectionId}/${tokenId}`;
  };
};
