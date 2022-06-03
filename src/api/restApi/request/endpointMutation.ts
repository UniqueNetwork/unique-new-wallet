/* eslint-disable */
import { MutationKey, MutationOptions, QueryClient } from 'react-query';

import { HttpError, Nullable } from './types';

export abstract class EndpointMutation<ClientModel, RequestParams = void> {
  protected meta: MutationOptions<ClientModel, HttpError, RequestParams> = {};

  getMeta(): MutationOptions<ClientModel, HttpError, RequestParams> {
    return this.meta;
  }

  getKey(): MutationKey | undefined {
    return undefined;
  }

  afterMutationStart(queryClient: QueryClient, payload: RequestParams): unknown {
    return;
  }

  afterMutationSuccess(
    queryClient: QueryClient,
    data: ClientModel,
    payload: RequestParams,
    context: unknown,
  ): void {
    return;
  }

  afterMutationError(
    queryClient: QueryClient,
    error: HttpError,
    payload: RequestParams,
    context: unknown,
  ): void {
    return;
  }

  afterMutationSettled(
    queryClient: QueryClient,
    data: ClientModel | undefined,
    error: Nullable<HttpError>,
    payload: RequestParams,
    context: unknown,
  ): void {
    return;
  }

  abstract request(payload?: RequestParams, signal?: AbortSignal): Promise<ClientModel>;
}
