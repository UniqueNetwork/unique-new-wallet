import { FC, useContext, useEffect, useMemo } from 'react';

import { usePropertiesService } from '@app/api';
import { ChainPropertiesResponse } from '@app/types/Api';
import ApiContext from '@app/api/ApiContext';
import { useApi } from '@app/hooks';

import { ChainPropertiesContext } from '.';

export const ChainPropertiesWrapper: FC<{
  initialProperties: ChainPropertiesResponse;
}> = ({ children, initialProperties }) => {
  const { currentChain } = useContext(ApiContext);
  const { data, refetch } = usePropertiesService();

  const { api } = useApi();

  useEffect(() => {
    refetch();
  }, [refetch, api]);

  const value = useMemo(() => {
    return {
      chainProperties: data || initialProperties,
    };
  }, [data, initialProperties, currentChain]);

  return (
    <ChainPropertiesContext.Provider value={value}>
      {children}
    </ChainPropertiesContext.Provider>
  );
};
