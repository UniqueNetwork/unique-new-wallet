import { ChainPropertiesResponse, Sdk } from '@unique-nft/sdk';
import { QueriesResults, useQueries } from 'react-query';

import { queryKeys } from '../keysConfig';

export const useChainProperties = (
  chainsUrl: string[],
): QueriesResults<ChainPropertiesResponse[]> => {
  return useQueries<ChainPropertiesResponse[]>(
    chainsUrl.map((baseUrl) => {
      return {
        queryKey: queryKeys.chain.properties(baseUrl),
        queryFn: () => new Sdk({ baseUrl, signer: null }).chain.properties(),
      };
    }),
  );
};
