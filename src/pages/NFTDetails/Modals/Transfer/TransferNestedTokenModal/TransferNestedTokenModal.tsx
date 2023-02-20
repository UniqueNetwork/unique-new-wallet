import { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import { useNotifications, Loader } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils/address';
import { TransferTokenBody } from '@unique-nft/sdk';
import { useQueryClient } from 'react-query';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';

import { Modal, TransferBtn } from '@app/components';
import { InputTransfer } from '@app/pages/NFTDetails/Modals/Transfer/components/InputTransfer';
import { useTokenParentGetById, useTokenTransfer } from '@app/api';
import { TokenModalsProps } from '@app/pages/NFTDetails/Modals';
import { TNestingToken } from '@app/pages/NFTDetails/type';
import { TransferRow } from '@app/pages/NFTDetails/Modals/Transfer/components/TransferRow';
import { FormWrapper } from '@app/pages/NFTDetails/Modals/Transfer/components/FormWrapper';
import { TransferNestedStagesModal } from '@app/pages/NFTDetails/Modals/Transfer/TransferNestedTokenModal/TransferNestedStagesModal';
import { useAccounts } from '@app/hooks';
import { queryKeys } from '@app/api/restApi/keysConfig';
import { TransferFormDataType } from '@app/pages/NFTDetails/Modals/Transfer/type';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';

export const TransferNestedTokenModal = ({
  token,
  onClose,
  onComplete,
}: TokenModalsProps<TNestingToken>) => {
  const {
    getFee,
    feeFormatted,
    submitWaitResult,
    feeError,
    submitWaitResultError,
    isLoadingSubmitResult,
    feeLoading,
  } = useTokenTransfer();

  const queryClient = useQueryClient();
  const { error, info } = useNotifications();
  const { selectedAccount } = useAccounts();
  const getTokenPath = useGetTokenPath();
  const navigate = useNavigate();
  const [isWaitingComplete, setIsWaitingComplete] = useState(false);

  const form = useForm<TransferFormDataType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      to: '',
      from: token?.nestingParentToken ? '' : token?.owner,
      address: selectedAccount?.address,
      tokenId: token?.tokenId,
      collectionId: token?.collectionId,
    },
  });

  const {
    formState: { isValid },
    setValue,
    control,
  } = form;

  const {
    data: parentToken,
    isFetching: isFetchingParentToken,
    isError: isErrorLoadingParentToken,
  } = useTokenParentGetById({
    tokenId: token?.nestingParentToken ? token?.tokenId : undefined,
    collectionId: token?.nestingParentToken ? token?.collectionId : undefined,
  });

  useEffect(() => {
    if (!isErrorLoadingParentToken) {
      return;
    }

    error('There was an error loading the parent token, please try again');
    onClose();
  }, [isErrorLoadingParentToken]);

  useEffect(() => {
    if (!parentToken?.address) {
      return;
    }
    setValue('from', parentToken.address);
  }, [parentToken?.address, setValue]);

  const formValues = useWatch({ control });
  const [transferDebounceValue] = useDebounce(formValues, 300);

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  useEffect(() => {
    if (!submitWaitResultError) {
      return;
    }
    error(submitWaitResultError);
  }, [submitWaitResultError]);

  useEffect(() => {
    isValid &&
      transferDebounceValue &&
      getFee(transferDebounceValue as TransferTokenBody);
  }, [transferDebounceValue, getFee]);

  const onSubmit = async (data: TransferFormDataType) => {
    try {
      setIsWaitingComplete(true);
      await submitWaitResult({
        payload: data,
      });
      await onComplete();
      setIsWaitingComplete(false);

      queryClient.invalidateQueries(queryKeys.token._def);
      info('Transfer completed successfully');
      navigate(getTokenPath(data.to, data.collectionId, data.tokenId));
    } catch {
      setIsWaitingComplete(false);
      onClose();
    }
  };

  if (isLoadingSubmitResult || isWaitingComplete) {
    return <TransferNestedStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title={token?.nestingParentToken ? 'Transfer nested token' : 'Transfer bundle'}
      footerButtons={
        <TransferBtn
          title="Confirm"
          disabled={!isValid}
          role="primary"
          onClick={form.handleSubmit(onSubmit)}
        />
      }
      onClose={onClose}
    >
      {isFetchingParentToken && <Loader isFullPage={true} />}
      <FormWrapper
        fee={isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
        feeLoading={feeLoading}
      >
        <FormProvider {...form}>
          <TransferRow>
            <Controller
              name="to"
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <InputTransfer
                    additionalText={
                      token?.nestingParentToken
                        ? 'When sending a token, you also send all nested tokens'
                        : 'When sending a bundle, you also send all nested tokens'
                    }
                    value={value}
                    error={!!fieldState.error}
                    statusText={fieldState.error?.message}
                    onChange={onChange}
                  />
                );
              }}
              rules={{
                required: true,
                validate: (val: string) =>
                  Address.is.ethereumAddress(val) ||
                  Address.is.substrateAddress(val) ||
                  'Invalid address',
              }}
            />
          </TransferRow>
        </FormProvider>
      </FormWrapper>
    </Modal>
  );
};
