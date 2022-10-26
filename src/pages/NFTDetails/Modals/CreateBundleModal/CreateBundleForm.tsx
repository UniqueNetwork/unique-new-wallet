import { Controller, useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { CollectionNestingOption } from '@app/api';
import { SuggestOptionNesting } from '@app/pages/NFTDetails/Modals/CreateBundleModal/components';
import { Token } from '@app/api/graphQL/types';
import { useGraphQlCollectionsByNestingAccount } from '@app/api/graphQL/collections';
import { useGraphQlGetTokensCollection } from '@app/api/graphQL/tokens/useGraphQlGetTokensCollection';
import { Suggest } from '@app/components/Suggest';
import { Alert } from '@app/components';

import { TCreateBundleForm } from './CreateBundleModal';

type Props = {
  collectionsData: ReturnType<typeof useGraphQlCollectionsByNestingAccount>;
  tokensData: ReturnType<typeof useGraphQlGetTokensCollection>;
  disabledNftField: boolean;
};

export const CreateBundleForm = ({
  collectionsData,
  tokensData,
  disabledNftField,
}: Props) => {
  const { resetField, control } = useFormContext<TCreateBundleForm>();

  const form = useWatch({
    control,
  });

  const isNotExistTokens = tokensData.tokens.length === 0;

  const { isCollectionsLoading, collections } = collectionsData;
  const { isTokensLoading, tokens } = tokensData;

  return (
    <FormWrapper>
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
                    title={suggestion.name}
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
        {isNotExistTokens && form?.collection && !isTokensLoading && (
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
                disabled: disabledNftField || isNotExistTokens,
              }}
              noSuggestMessage="No nesting tokens available"
              getSuggestionValue={({ token_name }) => token_name}
              onChange={onChange}
            />
          )}
        />
      </FormRow>
    </FormWrapper>
  );
};

const AlertWrapper = styled.div`
  margin-top: var(--prop-gap);
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--prop-gap);
`;

const FormRow = styled.div`
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
