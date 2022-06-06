import { QueryObserverOptions } from 'react-query/types/core/types';

import { EndpointQuery, HttpError } from '../request';

export type UseEndpointQueryOptions<
  ConcreteEndpointQuery extends EndpointQuery<
    Awaited<ReturnType<ConcreteEndpointQuery['request']>>,
    Parameters<ConcreteEndpointQuery['request']>[0]
  >,
  DataModel = Awaited<ReturnType<ConcreteEndpointQuery['request']>>,
> = QueryObserverOptions<
  Parameters<ConcreteEndpointQuery['request']>[0],
  HttpError,
  DataModel,
  Awaited<ReturnType<ConcreteEndpointQuery['request']>>
> & {
  refetchInterval?: number | false;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean | 'always';
  refetchOnReconnect?: boolean | 'always';
  useErrorBoundary?: boolean;
};
