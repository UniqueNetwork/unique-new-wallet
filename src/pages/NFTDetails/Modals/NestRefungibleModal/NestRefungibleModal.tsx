import React, { useEffect } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import styled from 'styled-components';
import { Address } from '@unique-nft/utils';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import {
  CollectionNestingOption,
  useTokenGetBalance,
  useTokenRefungibleTransfer,
} from '@app/api';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { Alert, Button, Modal } from '@app/components';
import { Suggest } from '@app/components/Suggest';
import { useGraphQlCollectionsByNestingAccount } from '@app/api/graphQL/collections';
import { Token } from '@app/api/graphQL/types';
import { useGraphQlGetTokensCollection } from '@app/api/graphQL/tokens/useGraphQlGetTokensCollection';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';

import { SuggestOptionNesting } from '../CreateBundleModal/components';
import { FormWrapper, InputAmount } from '../Transfer';
import { TokenModalsProps } from '../NFTModals';
import { NestRefungibleFormDataType } from './types';
import { NestRefungibleStagesModal } from './NestRefungibleStagesModal';

export const NestRefungibleModal = <T extends TBaseToken>({
  token,
  onClose,
  onComplete,
}: TokenModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const { info, error } = useNotifications();
  const getTokenPath = useGetTokenPath();
  const navigate = useNavigate();

  const {
    getFee,
    feeFormatted,
    submitWaitResult,
    isLoadingSubmitResult,
    feeError,
    submitWaitResultError,
  } = useTokenRefungibleTransfer();

  const { data: fractionsBalance } = useTokenGetBalance({
    collectionId: token?.collectionId,
    tokenId: token?.tokenId,
    address: selectedAccount?.address,
    isFractional: true,
  });

  const form = useForm<NestRefungibleFormDataType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      amount: 1,
    },
  });

  const {
    formState: { isValid },
    control,
    resetField,
  } = form;

  const collectionFormData = useWatch({ control });
  const [debouncedFormValues] = useDebounce(collectionFormData, 300);

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

  const { isCollectionsLoading, collections } = collectionsData;
  const { isTokensLoading, tokens } = tokensData;

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
    const { amount, collection, token: parentToken } = debouncedFormValues;
    const parentCollectionId = collection?.collection_id;
    const parentTokenId = parentToken?.token_id;

    if (
      !token ||
      !selectedAccount?.address ||
      !parentCollectionId ||
      !parentTokenId ||
      !amount
    ) {
      return;
    }

    getFee({
      collectionId: token.collectionId,
      tokenId: token.tokenId,
      address: selectedAccount.address,
      to: Address.nesting.idsToAddress(parentCollectionId, parentTokenId),
      amount,
    });
  }, [debouncedFormValues, token, selectedAccount?.address]);

  const burnHandler = ({
    amount,
    collection,
    token: parentToken,
  }: NestRefungibleFormDataType) => {
    const parentCollectionId = collection?.collection_id;
    const parentTokenId = parentToken?.token_id;
    if (
      !token ||
      !selectedAccount?.address ||
      !parentCollectionId ||
      !parentTokenId ||
      !amount
    ) {
      return;
    }

    const to = Address.nesting.idsToAddress(parentCollectionId, parentTokenId);
    const { collectionId, tokenId } = token;

    submitWaitResult({
      payload: {
        collectionId,
        tokenId,
        address: selectedAccount.address,
        to,
        amount,
      },
    }).then(() => {
      info('RFT transferred successfully');
      if (fractionsBalance?.amount === amount) {
        navigate(getTokenPath(to, collectionId, tokenId));
        return;
      }
      onComplete();
    });
  };

  const isNotExistTokens = tokensData.tokens.length === 0;

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoadingSubmitResult) {
    return <NestRefungibleStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Nest fractional token"
      footerButtons={
        <Button
          title="Confirm"
          disabled={!isValid}
          role="primary"
          onClick={form.handleSubmit(burnHandler)}
        />
      }
      onClose={onClose}
    >
      <FormWrapper
        fee={feeFormatted}
        feeWarning="A fee will be calculated after entering the amount"
      >
        <FormProvider {...form}>
          <FormRow>
            <Controller
              name="amount"
              render={({ field: { value, onChange } }) => {
                return (
                  <InputAmount
                    value={value}
                    maxValue={fractionsBalance?.amount || 0}
                    onChange={onChange}
                    onClear={() => onChange('')}
                  />
                );
              }}
              rules={{
                required: true,
                validate: (val: string) => Number(val) > 0,
              }}
            />
          </FormRow>
          <FormRow>
            <div>
              <label>Collections</label>
              <p>A list of collections that can be nested.</p>
            </div>
            <Controller
              name="collection"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Suggest<CollectionNestingOption>
                  components={{
                    SuggestItem: ({
                      suggestion,
                      isActive,
                    }: {
                      suggestion: CollectionNestingOption;
                      isActive?: boolean;
                    }) => (
                      <SuggestOptionNesting
                        isActive={Boolean(isActive)}
                        title={`${suggestion.name} [id ${suggestion.collection_id}]`}
                        img={suggestion.collection_cover}
                        typeAvatar="circle"
                      />
                    ),
                  }}
                  suggestions={collections}
                  isLoading={isCollectionsLoading}
                  value={value}
                  getActiveSuggestOption={(option) =>
                    option.collection_id === value.collection_id
                  }
                  getSuggestionValue={({ name }) => name}
                  onChange={(val) => {
                    resetField('token');
                    onChange(val);
                  }}
                />
              )}
            />
            {isNotExistTokens && debouncedFormValues?.collection && !isTokensLoading && (
              <AlertWrapper>
                <Alert type="error">
                  You don’t have any tokens with bundling capabilities in this collection
                </Alert>
              </AlertWrapper>
            )}
          </FormRow>
          <FormRow>
            <div>
              <label>Parent NFT</label>
              <p>
                A token that will become the bundle owner and the root of the nested
                structure. You can provide only a token that you own.
              </p>
            </div>
            <Controller
              name="token"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Suggest<Token>
                  components={{
                    SuggestItem: ({
                      suggestion,
                      isActive,
                    }: {
                      suggestion: Token;
                      isActive?: boolean;
                    }) => (
                      <SuggestOptionNesting
                        isActive={Boolean(isActive)}
                        title={suggestion.token_name}
                        img={suggestion.image?.fullUrl}
                        typeAvatar="square"
                      />
                    ),
                  }}
                  suggestions={tokens}
                  isLoading={isTokensLoading}
                  value={value}
                  getActiveSuggestOption={(option) => option.token_id === value.token_id}
                  inputProps={{
                    disabled: isNotExistTokens,
                  }}
                  noSuggestMessage="No nesting tokens available"
                  getSuggestionValue={({ token_name }) => token_name}
                  onChange={onChange}
                />
              )}
            />
          </FormRow>
        </FormProvider>
      </FormWrapper>
    </Modal>
  );
};

const FormRow = styled.div`
  margin-bottom: calc(var(--gap) * 1.5);
  .unique-input-text,
  .unique-suggestion-wrapper {
    width: 100%;
  }
  .unique-suggestion-wrapper {
    margin-top: var(--prop-gap);
  }
  label {
    font-weight: 500;
    display: block;
    margin-bottom: calc(var(--prop-gap) / 2);
  }

  p {
    font-size: 14px;
    color: var(--color-grey-500);
  }
`;

const AlertWrapper = styled.div`
  margin-top: var(--prop-gap);
`;
