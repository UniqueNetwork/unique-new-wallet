import { useEffect, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Address } from '@unique-nft/utils';
import { NestTokenBody, TokenId } from '@unique-nft/sdk';

import { Modal, BaseActionBtn, Alert, Loader, useNotifications } from '@app/components';
import { TBaseToken } from '@app/pages/TokenDetails/type';
import { TokenModalsProps } from '@app/pages/TokenDetails/Modals';
import {
  useGraphQlCollectionsByNestingAccount,
  useGraphQlGetCollectionsByIds,
} from '@app/api/graphQL/collections';
import { useAccounts } from '@app/hooks';
import { CollectionNestingOption, useTokenNest } from '@app/api';
import { Token } from '@app/api/graphQL/types';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { CreateBundleStagesModal } from '@app/pages/TokenDetails/Modals/CreateBundleModal/CreateBundleStagesModal';
import { CreateBundleForm } from '@app/pages/TokenDetails/Modals/CreateBundleModal/CreateBundleForm';
import { queryKeys } from '@app/api/restApi/keysConfig';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';
import { useAllOwnedTokensByCollection } from '@app/pages/TokenDetails/hooks/useAllOwnedTokensByCollection';
import { useTransactionFormService } from '@app/hooks/useTransactionModalService';

import { NOT_ENOUGH_BALANCE_MESSAGE } from '../constants';

export type TCreateBundleForm = {
  collection: CollectionNestingOption | null;
  token: Token | null;
};

export const CreateBundleModal = <T extends TBaseToken>({
  token,
  onClose,
  onComplete,
}: TokenModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const navigate = useNavigate();
  const getTokenPath = useGetTokenPath();
  const [isWaitingComplete, setIsWaitingComplete] = useState(false);

  const {
    form,
    formData,
    submitWaitResult,
    getFee,
    feeFormatted,
    feeLoading,
    debouncedFormValues,
    isSufficientBalance,
  } = useTransactionFormService<TokenId, NestTokenBody, TCreateBundleForm>({
    MutateAsyncFunction: useTokenNest,
    account: selectedAccount,
    defaultValues: {
      collection: null,
      token: null,
    },
  });

  const { formState, handleSubmit } = form;

  const { info } = useNotifications();

  const queryClient = useQueryClient();

  const { collectionsIds } = useGraphQlCollectionsByNestingAccount({
    accountAddress: selectedAccount?.address,
  });

  const collectionsData = useGraphQlGetCollectionsByIds({
    collections: collectionsIds?.map(({ collection_id }) => ({
      collectionId: collection_id,
    })),
  });

  const tokensData = useAllOwnedTokensByCollection(formData?.collection?.collection_id, {
    excludeTokenId:
      formData?.collection?.collection_id === token?.collectionId
        ? token?.tokenId
        : undefined,
  });

  useEffect(() => {
    collectionsData.refetchCollectionsByIds();
  }, [collectionsIds]);

  const onSubmit = async (form: TCreateBundleForm) => {
    if (!token || !selectedAccount || !form.token || !form.collection) {
      return;
    }
    try {
      setIsWaitingComplete(true);
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

      await onComplete();

      navigate(
        getTokenPath(
          Address.nesting.idsToAddress(
            form.collection.collection_id,
            form.token.token_id,
          ),
          token.collectionId,
          token.tokenId,
        ),
      );
      info(`${form.token?.token_name} nested into ${token.name}`);

      setIsWaitingComplete(false);

      queryClient.invalidateQueries(queryKeys.token._def);
    } catch {
      onClose();

      setIsWaitingComplete(false);
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
    formState.isValid &&
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
  }, [debouncedFormValues, getFee, formState.isValid, selectedAccount, token]);

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
        {feeFormatted && formState.isValid ? (
          <FeeInformationTransaction fee={feeFormatted} />
        ) : (
          <Alert type="warning">
            A fee will be calculated after corrected filling required fields
          </Alert>
        )}
      </FeeContainer>
    );
  };

  const validationMessage = useMemo(() => {
    if (!form.formState.isValid) {
      return 'Please, select collection and token';
    }
    if (!isSufficientBalance) {
      return `${NOT_ENOUGH_BALANCE_MESSAGE} ${selectedAccount?.unitBalance || 'coins'}`;
    }
    return null;
  }, [form.formState, isSufficientBalance, selectedAccount]);

  if (isWaitingComplete) {
    return <CreateBundleStagesModal />;
  }

  return (
    <Modal
      title="Create bundle"
      isVisible={true}
      footerButtons={
        <BaseActionBtn
          title="Confirm"
          disabled={!formState.isValid || !isSufficientBalance}
          role="primary"
          actionEnabled={formState.isValid}
          actionText={validationMessage || ''}
          tooltip={validationMessage}
          onClick={handleSubmit(onSubmit)}
        />
      }
      onClose={onClose}
    >
      <FormProvider {...form}>
        <CreateBundleForm
          collectionsData={collectionsData}
          tokensData={tokensData}
          disabledNftField={!formData?.collection}
        />
      </FormProvider>
      {feeResults()}
    </Modal>
  );
};

const FeeContainer = styled.div`
  margin-top: calc(var(--prop-gap) * 2);
`;
