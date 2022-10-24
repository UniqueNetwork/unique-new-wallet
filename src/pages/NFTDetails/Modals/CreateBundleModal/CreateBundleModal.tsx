import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Alert, Loader, useNotifications } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import { useDebounce } from 'use-debounce';
import { useQueryClient } from 'react-query';

import { Modal, TransferBtn } from '@app/components';
import { TToken } from '@app/pages/NFTDetails/type';
import { NFTModalsProps } from '@app/pages/NFTDetails/Modals';
import { useGraphQlCollectionsByNestingAccount } from '@app/api/graphQL/collections';
import { useAccounts } from '@app/hooks';
import { CollectionNestingOption, useTokenNest } from '@app/api';
import { useGraphQlGetTokensCollection } from '@app/api/graphQL/tokens/useGraphQlGetTokensCollection';
import { Token } from '@app/api/graphQL/types';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { CreateBundleStagesModal } from '@app/pages/NFTDetails/Modals/CreateBundleModal/CreateBundleStagesModal';
import { CreateBundleForm } from '@app/pages/NFTDetails/Modals/CreateBundleModal/CreateBundleForm';
import { queryKeys } from '@app/api/restApi/keysConfig';

type Props<T> = Omit<NFTModalsProps<T>, 'modalType'> & {
  isVisible: boolean;
};

export type TCreateBundleForm = {
  collection: CollectionNestingOption | null;
  token: Token | null;
};

export const CreateBundleModal = <T extends TToken>({
  token,
  onClose,
  isVisible,
}: Props<T>) => {
  const { selectedAccount } = useAccounts();
  const form = useForm<TCreateBundleForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      collection: null,
      token: null,
    },
  });

  const {
    formState: { isValid },
    handleSubmit,
    control,
  } = form;

  const collectionFormData = useWatch({ control });

  const [debouncedFormValues] = useDebounce(collectionFormData, 300);

  const { error, info } = useNotifications();
  const {
    submitWaitResult,
    getFee,
    feeLoading,
    isLoadingSubmitResult,
    feeFormatted,
    feeError,
  } = useTokenNest();

  const queryClient = useQueryClient();

  const collectionsData = useGraphQlCollectionsByNestingAccount({
    accountAddress: selectedAccount?.address,
  });

  const tokensData = useGraphQlGetTokensCollection({
    collectionId: collectionFormData?.collection?.collection_id,
    excludeCurrentTokenId:
      collectionFormData?.collection?.collection_id === token?.collectionId
        ? token?.tokenId
        : undefined,
  });

  const onSubmit = async (form: TCreateBundleForm) => {
    try {
      if (!token || !selectedAccount || !form.token || !form.collection) {
        return;
      }
      await submitWaitResult({
        payload: {
          parent: {
            collectionId: form.collection.collection_id,
            tokenId: form.token.token_id,
          },
          address: selectedAccount.address,
          nested: {
            collectionId: token.collectionId,
            tokenId: token.tokenId,
          },
        },
      });
      onClose();

      info(`${form.token?.token_name} nested into ${token.name}`);
      await queryClient.invalidateQueries(queryKeys.token.isBundle._def);
      await queryClient.invalidateQueries(queryKeys.token.byId._def);
    } catch (res: any) {
      error(res.error.message);
    }
  };

  useEffect(() => {
    if (
      !debouncedFormValues.collection ||
      !debouncedFormValues.token ||
      !selectedAccount ||
      !token
    ) {
      return;
    }
    isValid &&
      getFee({
        parent: {
          collectionId: debouncedFormValues.collection.collection_id!,
          tokenId: debouncedFormValues.token.token_id!,
        },
        address: selectedAccount?.address,
        nested: {
          collectionId: token.collectionId,
          tokenId: token.tokenId,
        },
      });
  }, [debouncedFormValues, getFee, isValid, selectedAccount, token]);

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  const feeResults = () => {
    if (feeLoading) {
      return (
        <FeeContainer>
          <Loader size="small" />
        </FeeContainer>
      );
    }
    return (
      <FeeContainer>
        {feeFormatted && isValid ? (
          <FeeInformationTransaction fee={feeFormatted} />
        ) : (
          <Alert type="warning">
            A fee will be calculated after corrected filling required fields
          </Alert>
        )}
      </FeeContainer>
    );
  };

  if (isLoadingSubmitResult) {
    return <CreateBundleStagesModal />;
  }

  return (
    <Modal
      title="Create bundle"
      isVisible={isVisible}
      footerButtons={
        <TransferBtn
          title="Confirm"
          disabled={!isValid || feeLoading}
          onClick={handleSubmit(onSubmit)}
        />
      }
      onClose={onClose}
    >
      <FormProvider {...form}>
        <CreateBundleForm
          collectionsData={collectionsData}
          tokensData={tokensData}
          disabledNftField={!collectionFormData?.collection}
        />
      </FormProvider>
      {feeResults()}
    </Modal>
  );
};

const FeeContainer = styled.div`
  margin-top: calc(var(--prop-gap) * 2);
`;
