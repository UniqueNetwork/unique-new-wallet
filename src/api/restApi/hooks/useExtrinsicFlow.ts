import { ExtrinsicResultResponse, IMutation } from '@unique-nft/sdk';
import { useMutation } from 'react-query';

import { useAccounts } from '@app/hooks';
import { UNKNOWN_ERROR_MSG } from '@app/api/restApi/hooks/constants';

export const useExtrinsicFlow = <A, R>(mutation: IMutation<A, R>) => {
  const { signMessage } = useAccounts();
  const { selectedAccount } = useAccounts();

  const submitWaitResult = async ({
    senderAddress,
    payload,
  }: {
    payload: A;
    senderAddress?: string;
  }) => {
    const build = await mutation.build(payload);

    const account = senderAddress || selectedAccount?.address;

    const signature = await signMessage(build, account);

    return mutation.submitWaitResult({
      signerPayloadJSON: build.signerPayloadJSON,
      signature,
    });
  };

  const submitResultMutationQueryResult = useMutation<
    ExtrinsicResultResponse<R> | undefined,
    Error,
    { payload: A; senderAddress?: string | undefined },
    unknown
  >(submitWaitResult);

  return {
    submitWaitResult: submitResultMutationQueryResult.mutateAsync,
    isLoadingSubmitResult: submitResultMutationQueryResult.isLoading,
    submitWaitResultError: submitResultMutationQueryResult.isError
      ? submitResultMutationQueryResult.error?.message || UNKNOWN_ERROR_MSG
      : null,
  };
};
