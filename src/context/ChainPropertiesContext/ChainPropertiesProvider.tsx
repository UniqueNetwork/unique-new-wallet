import { FC, useEffect, useMemo, useRef } from 'react';

import { IBaseApi, usePropertiesService } from '@app/api';
import { useApi } from '@app/hooks';

import { ChainPropertiesProvider } from './ChainPropertiesContext';

export const ChainPropertiesWrapper: FC = ({ children }) => {
  const { api } = useApi();
  const apiRef = useRef<IBaseApi>();
  const { data, isFetching, refetch } = usePropertiesService();

  const value = useMemo(
    () => ({
      chainProperties: data,
      isLoading: isFetching,
    }),
    [data, isFetching],
  );

  useEffect(() => {
    if (apiRef.current && apiRef.current !== api) {
      // void refetch();
    }

    apiRef.current = api;
  }, [api, refetch]);

  return <ChainPropertiesProvider value={value}>{children}</ChainPropertiesProvider>;
};
