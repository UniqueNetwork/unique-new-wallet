import { useQuery, UseQueryResult, QueryKey } from 'react-query';
import { useEffect, useRef } from 'react';

import { useApi } from '@app/hooks';
import { IBaseApi } from '@app/api';

import { EndpointQuery, HttpError } from '../request';
import { UseEndpointQueryOptions } from './types';

interface ApiQueryConfig<
  ConcreteEndpointQuery extends EndpointQuery<
    Awaited<ReturnType<ConcreteEndpointQuery['request']>>,
    Parameters<ConcreteEndpointQuery['request']>[1]
  >,
  DataModel = Awaited<ReturnType<ConcreteEndpointQuery['request']>>,
> {
  endpoint: ConcreteEndpointQuery;
  payload?: Parameters<ConcreteEndpointQuery['request']>[1];
  options?: UseEndpointQueryOptions<ConcreteEndpointQuery, DataModel>;
}

export const useApiQuery = <
  ConcreteEndpointQuery extends EndpointQuery<
    Awaited<ReturnType<ConcreteEndpointQuery['request']>>,
    Parameters<ConcreteEndpointQuery['request']>[1]
  >,
  DataModel = Awaited<ReturnType<ConcreteEndpointQuery['request']>>,
>(
  queryConfig: ApiQueryConfig<ConcreteEndpointQuery, DataModel>,
): UseQueryResult<DataModel, HttpError> => {
  const { api } = useApi();
  const apiRef = useRef<IBaseApi>();
  const endpointOptions = queryConfig.endpoint.getMeta();
  const queryOptions: typeof queryConfig['options'] = queryConfig.options || {};

  const combinedQueryOptions: typeof queryConfig['options'] = {
    ...endpointOptions, // order matters because we let hook options override endpoint options
    ...queryOptions,
    enabled: !!api && !!queryOptions.enabled,
  };

  const queryKey: QueryKey = queryConfig.endpoint.getKey(queryConfig.payload);

  const reactQueryObject: any = useQuery(
    queryKey,
    ({ signal }) => queryConfig.endpoint.request(api, queryConfig.payload, signal),
    combinedQueryOptions as any,
  );

  useEffect(() => {
    if (apiRef.current && apiRef.current !== api) {
      void reactQueryObject.refetch();
    }

    apiRef.current = api;
  }, [api, reactQueryObject]);

  return reactQueryObject;
};
