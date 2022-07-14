import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';

import { EndpointMutation, HttpError, Nullable } from '../request';

interface CombinedContext {
  endpointContext: unknown;
  optionsContext?: unknown;
}

export interface ApiMutationConfig<
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >,
> {
  endpoint: ConcreteEndpointMutation;
  options?: UseMutationOptions<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    HttpError,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >;
}

export const useApiMutation = <
  ConcreteEndpointMutation extends EndpointMutation<
    Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    Parameters<ConcreteEndpointMutation['request']>[0]
  >,
>(
  mutationConfig: ApiMutationConfig<ConcreteEndpointMutation>,
): UseMutationResult<
  Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
  HttpError,
  Parameters<ConcreteEndpointMutation['request']>[0]
> => {
  const endpointOptions = mutationConfig.endpoint.getMeta();
  const mutationOptions: typeof mutationConfig['options'] = mutationConfig.options || {};
  const combinedMutationOptions: typeof mutationConfig['options'] = {
    ...endpointOptions, // order matters because we let hook options override endpoint options
    ...mutationOptions,
    mutationKey: mutationConfig.endpoint.getKey(),
  };

  const queryClient = useQueryClient();

  combinedMutationOptions.onMutate = (
    payload: Parameters<ConcreteEndpointMutation['request']>[0],
  ) => {
    const context: CombinedContext = {
      endpointContext: mutationConfig.endpoint.afterMutationStart(queryClient, payload),
    };

    if (mutationConfig.options?.onMutate) {
      context.optionsContext = mutationConfig.options.onMutate(payload);
    }

    return context;
  };

  combinedMutationOptions.onMutate = (
    payload: Parameters<ConcreteEndpointMutation['request']>[0],
  ) => {
    const context: CombinedContext = {
      endpointContext: mutationConfig.endpoint.afterMutationStart(queryClient, payload),
    };

    if (mutationConfig.options?.onMutate) {
      context.optionsContext = mutationConfig.options.onMutate(payload);
    }

    return context;
  };

  combinedMutationOptions.onSuccess = (
    data: Awaited<ReturnType<ConcreteEndpointMutation['request']>>,
    payload: Parameters<ConcreteEndpointMutation['request']>[0],
    context: unknown,
  ) => {
    mutationConfig.endpoint.afterMutationSuccess(
      queryClient,
      data,
      payload,
      (context as CombinedContext).endpointContext,
    );

    if (mutationConfig.options?.onSuccess) {
      mutationConfig.options.onSuccess(
        data,
        payload,
        (context as CombinedContext).optionsContext,
      );
    }
  };

  combinedMutationOptions.onError = (
    error: HttpError,
    payload: Parameters<ConcreteEndpointMutation['request']>[0],
    context: unknown,
  ) => {
    mutationConfig.endpoint.afterMutationError(
      queryClient,
      error,
      payload,
      (context as CombinedContext).endpointContext,
    );

    if (mutationConfig.options?.onError) {
      mutationConfig.options.onError(
        error,
        payload,
        (context as CombinedContext).optionsContext,
      );
    }
  };

  combinedMutationOptions.onSettled = (
    data: Awaited<ReturnType<ConcreteEndpointMutation['request']>> | undefined,
    error: Nullable<HttpError>,
    payload: Parameters<ConcreteEndpointMutation['request']>[0],
    context: unknown,
  ) => {
    mutationConfig.endpoint.afterMutationSettled(
      queryClient,
      data,
      error,
      payload,
      (context as CombinedContext).endpointContext,
    );

    if (mutationConfig.options?.onSettled) {
      mutationConfig.options.onSettled(
        data,
        error,
        payload,
        (context as CombinedContext).optionsContext,
      );
    }
  };

  return useMutation(mutationConfig.endpoint.request, combinedMutationOptions);
};
