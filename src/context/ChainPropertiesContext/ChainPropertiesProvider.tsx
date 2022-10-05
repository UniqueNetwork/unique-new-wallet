import { FC, useEffect, useMemo } from 'react';

import { usePropertiesService } from '@app/api';
import { ChainPropertiesResponse } from '@app/types/Api';
import { useApi } from '@app/hooks';

import { ChainPropertiesContext } from '.';

export const ChainPropertiesWrapper: FC<{
  initialProperties: ChainPropertiesResponse;
}> = ({ children, initialProperties }) => {
  const { data, refetch } = usePropertiesService();

  const { api } = useApi();

  useEffect(() => {
    refetch();
  }, [api, refetch]);

  const value = useMemo(() => {
    return {
      chainProperties: data || initialProperties,
    };
  }, [data, initialProperties]);

  return (
    <ChainPropertiesContext.Provider value={value}>
      {children}
    </ChainPropertiesContext.Provider>
  );
};
