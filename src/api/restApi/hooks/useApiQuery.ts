import { useQuery, UseQueryResult, QueryKey } from 'react-query';

import { useApi } from '@app/hooks';
import { BaseApi } from '@app/api';

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
  baseURL?: string;
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
  const endpointOptions = queryConfig.endpoint.getMeta();
  const baseUrl = queryConfig.baseURL ?? api?.baseURL;
  const baseApi = queryConfig.baseURL ? new BaseApi(queryConfig.baseURL) : api;
  const queryOptions: typeof queryConfig['options'] = queryConfig.options || {};

  const combinedQueryOptions: typeof queryConfig['options'] = {
    ...endpointOptions, // order matters because we let hook options override endpoint options
    ...queryOptions,
    enabled: !!baseApi && !!queryOptions.enabled,
  };

  const queryKey: QueryKey = queryConfig.endpoint.getKey(queryConfig.payload);
  if (baseUrl && Array.isArray(queryKey)) {
    queryKey.push(baseUrl);
  }

  return useQuery(
    queryKey,
    ({ signal }) => queryConfig.endpoint.request(baseApi, queryConfig.payload, signal),
    combinedQueryOptions as any,
  );
};
