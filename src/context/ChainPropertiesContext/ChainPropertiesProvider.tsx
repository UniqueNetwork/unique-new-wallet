import { FC, useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { getChainProperties, IBaseApi } from '@app/api/restApi';
import { ChainProperties } from '@app/types/Api';
import { useApi } from '@app/hooks';

import { ChainPropertiesProvider } from './ChainPropertiesContext';

export const ChainPropertiesWrapper: FC = ({ children }) => {
  const [chainProperties, setChainProperties] = useState<ChainProperties>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { api } = useApi();
  const apiRef = useRef<IBaseApi>();

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getChainProperties(api!);

    setChainProperties(data);

    setIsLoading(false);
  }, [api]);

  const value = useMemo(
    () => ({
      chainProperties,
      isLoading,
    }),
    [chainProperties, isLoading],
  );

  useEffect(() => {
    if (apiRef.current !== api) {
      void fetchProperties();
    }

    apiRef.current = api;
  }, [api, fetchProperties]);

  return <ChainPropertiesProvider value={value}>{children}</ChainPropertiesProvider>;
};
