import { useQuery, UseQueryResult } from 'react-query';
import { ChainPropertiesResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

export const usePropertiesService = (): UseQueryResult<ChainPropertiesResponse> => {
  const { api } = useApi();

  return useQuery(['chain', 'properties'], () => api.chain.properties(), {
    enabled: false,
  });
};
