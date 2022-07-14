import { FC, useMemo } from 'react';

import { usePropertiesService } from '@app/api';
import { ChainPropertiesResponse } from '@app/types/Api';

import { ChainPropertiesProvider } from './ChainPropertiesContext';

export const ChainPropertiesWrapper: FC<{
  initialProperties: ChainPropertiesResponse;
}> = ({ children, initialProperties }) => {
  const { data } = usePropertiesService();

  const value = useMemo(() => {
    return {
      chainProperties: data || initialProperties,
    };
  }, [data, initialProperties]);

  return <ChainPropertiesProvider value={value}>{children}</ChainPropertiesProvider>;
};
