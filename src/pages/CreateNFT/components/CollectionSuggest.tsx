import { Address } from '@unique-nft/utils/address';
import { FC, Fragment, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useLocation, useSearchParams } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { Avatar, SuggestListProps, Tag, Typography } from '@app/components';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { Collection, TokenTypeEnum } from '@app/api/graphQL/types';
import { getTokenIpfsUriByImagePath } from '@app/utils';

import { LabelText, SuggestOption } from '../../components/FormComponents';
import { Button } from '../../../components/Button/Button';
import { Suggest } from '../../../components/Suggest/Suggest';

export interface CollectionItem {
  id: number;
  title: string;
  description: string | undefined;
  img: string | undefined;
  tokensLimit?: number;
  tokensCount: number;
  mode: string;
}

type CollectionSuggestProps = {
  collection?: Collection;
  onChange(collection: Collection | undefined): void;
};

export const CollectionSuggest: FC<CollectionSuggestProps> = ({
  collection,
  onChange,
}) => {
  const [params] = useSearchParams();
  const collectionId = Number(params.get('collectionId') || 0);
  const { state: locationState } = useLocation();
  const { selectedAccount } = useAccounts();
  const presetCollection = locationState as Collection;

  useEffect(() => {
    if (!presetCollection) {
      return;
    }
    onChange(presetCollection);
  }, [onChange, presetCollection, collectionId]);

  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress:
      selectedAccount && Address.is.ethereumAddressInAnyForm(selectedAccount?.address)
        ? Address.mirror.ethereumToSubstrate(selectedAccount.address)
        : selectedAccount?.address,
    options: defaultOptions,
  });

  useEffect(() => {
    if (collectionId) {
      onChange(collections.find(({ collection_id }) => collectionId === collection_id));
    }
  }, [collections, collectionId]);

  const collectionsOptions: CollectionItem[] = useMemo(() => {
    const presetCollectionExists =
      collections.findIndex(
        ({ collection_id }) => collection_id === presetCollection?.collection_id,
      ) !== -1;
    return [
      ...(collections
        // filter NFT collections only until RFT minting is implemented
        //.filter((collection) => collection.mode === TokenTypeEnum.NFT)
        .map<CollectionItem>((collection) => ({
          id: collection.collection_id,
          title: collection.name,
          description: collection.description,
          img: getTokenIpfsUriByImagePath(collection.collection_cover),
          tokensCount: collection.tokens_count,
          tokensLimit: collection.token_limit,
          mode: collection.mode,
        })) ?? []),
      ...(presetCollection?.collection_id && !presetCollectionExists
        ? [
            {
              id: presetCollection.collection_id,
              title: presetCollection.name,
              description: presetCollection.description,
              img: getTokenIpfsUriByImagePath(presetCollection.collection_cover),
              tokensCount: 0,
              mode: presetCollection.mode,
            },
          ]
        : []),
    ];
  }, [collections, presetCollection]);

  const collectionOption = useMemo(() => {
    if (!collection) {
      return undefined;
    }
    return {
      id: collection.collection_id,
      title: collection.name,
      description: collection.description,
      img: getTokenIpfsUriByImagePath(collection.collection_cover),
      tokensCount: 0,
      mode: collection.mode,
    };
  }, [collection]);

  return (
    <CollectionSuggestWrapper>
      <LabelText>Collection*</LabelText>
      <Suggest<CollectionItem>
        isManaged
        isClearable={false}
        components={{
          SuggestItem: CollectionSuggestion,
          SuggestList: CollectionsSuggestionList,
        }}
        suggestions={collectionsOptions}
        isLoading={isCollectionsLoading}
        value={collectionOption}
        getActiveSuggestOption={(option: CollectionItem) => {
          return option.id === collection?.collection_id;
        }}
        getSuggestionValue={({ title }: CollectionItem) => title}
        onChange={(value) => {
          onChange(
            value
              ? collections.find(({ collection_id }) => collection_id === value?.id)
              : undefined,
          );
        }}
        onSuggestionsFetchRequested={(value) =>
          collectionsOptions.filter(
            ({ id, title }) =>
              title.toLowerCase().includes(value.toLowerCase()) ||
              id.toString().includes(value),
          )
        }
      />
    </CollectionSuggestWrapper>
  );
};

export const CollectionSuggestWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: calc(var(--prop-gap) * 2);
  align-items: center;
  & > .unique-text {
    margin-bottom: 0;
  }
  & .unique-suggestion-wrapper {
    flex: 1;
    width: 100%;
    .unique-input-text.size-middle {
      width: 100%;
    }
  }
`;

const CollectionsSuggestionList: FC<SuggestListProps<CollectionItem>> = ({
  suggestions,
  children,
}) => {
  return (
    <>
      <CreateCollectionOption
        role="ghost"
        title={<Typography color="primary-500">Create collection</Typography>}
        iconLeft={{ name: 'plus', size: 16, color: 'var(--color-primary-500)' }}
        onClick={() => {}}
      />
      {suggestions.map((suggest, idx) => (
        <Fragment key={idx}>{children(suggest, idx === suggestions.length - 1)}</Fragment>
      ))}
    </>
  );
};

const CreateCollectionOption = styled(Button)`
  padding-left: calc(var(--prop-gap) / 2) !important;
`;

const defaultOptions = {
  skip: false,
  pagination: {
    page: 0,
    limit: 300,
  },
};

const CollectionSuggestion: FC<{
  suggestion: CollectionItem;
  isActive?: boolean;
}> = ({ suggestion, isActive }) => {
  return (
    <SuggestOption
      className={classNames('suggestion-item', {
        isActive,
      })}
    >
      <Avatar size={24} type="circle" src={suggestion.img || undefined} />
      <span className="suggestion-item__title">
        {suggestion.title} [id {suggestion.id}]
      </span>
      {suggestion.mode === 'RFT' && <Tag label="FRACTIONAL" type="info" />}
    </SuggestOption>
  );
};
