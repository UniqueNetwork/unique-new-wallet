import { useQuery, UseQueryResult } from 'react-query';
import { TokenBalanceResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useTokenGetBalance = ({
  collectionId,
  tokenId,
  address,
  isFractional,
}: {
  collectionId?: number;
  tokenId?: number;
  address?: string;
  isFractional?: boolean;
}): UseQueryResult<TokenBalanceResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.token.balance(collectionId, tokenId, address),
    () =>
      api.refungible.getBalance({
        collectionId: collectionId!,
        tokenId: tokenId!,
        address: address!,
      }),
    {
      enabled: !!collectionId && !!tokenId && !!address && isFractional,
      retryOnMount: true,
    },
  );
};
