import { QueryObserverOptions } from 'react-query/types/core/types';

export interface HttpError {
  status: number;
  code: Nullable<string>;
  message: Nullable<string>;
}

export type Nullable<T> = T | null;

export type AuthHeaders = Record<string, string>;

export type EndpointQueryMeta<DataModel, RequestParams = void> = Pick<
  QueryObserverOptions<RequestParams, HttpError, DataModel, DataModel>,
  'retry' | 'retryDelay' | 'staleTime' | 'cacheTime' | 'initialData'
>;
