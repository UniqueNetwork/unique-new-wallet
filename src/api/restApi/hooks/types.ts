import { QueryObserverOptions } from 'react-query/types/core/types';

import { IBaseApi } from '@app/api';

import { EndpointQuery, HttpError } from '../request';

export type Payload<TBody> = {
  api: IBaseApi;
  body: TBody;
};

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

export type TExtrinsicType =
  | 'create-token'
  | 'create-collection'
  | 'burn-token'
  | 'burn-collection'
  | 'transfer-token'
  | 'transfer-balance';

export type TCollectionsCacheVar = { collectionId: number; path: string | undefined }[];
export type TTokensCacheVar = {
  tokenId: number;
  collectionId: number;
  path: string | undefined;
}[];
