import { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { useAccounts, useApi } from '@app/hooks';
import {
  ConfirmBtn,
  ProgressBar,
  StatusTransactionModal,
  Typography,
  useNotifications,
} from '@app/components';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { ROUTE, MY_TOKENS_TABS_ROUTE } from '@app/routes';
import { Collection } from '@app/api/graphQL/types';
import {
  useCollectionGetLastTokenId,
  useCreateMultipleTokens,
  useExtrinsicCacheEntities,
  useFileUpload,
} from '@app/api';

import { WrapperContent } from '../components/PageComponents';
import { CollectionSuggest } from './components/CollectionSuggest';
import { TokenList } from './components/TokenList';
import { CreateTokenDialog, NewToken } from './types';
import { CreateTokensDialogs } from './components/CreateTokensDialogs';
import { checkRequiredAttributes, mapTokensToPayload } from './helpers';
import { UploadFAB } from './components/UploadFAB';

export const CreateNFTv2Component: FC<{ className?: string }> = ({ className }) => {
  const [collection, setCollection] = useState<Collection>();
  const [collectionToSubmit, setCollectionToSubmit] = useState<Collection>();
  const [tokens, setTokens] = useState<NewToken[]>([]);
  const [dialog, setDialog] = useState<CreateTokenDialog>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState<boolean>(false);
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const { info } = useNotifications();
  const { setPayloadEntity } = useExtrinsicCacheEntities();
  const {
    selectedAccount,
    accounts: { size: accountsLength },
  } = useAccounts();
  const { data } = useCollectionGetLastTokenId(collection?.collection_id);
  const { tokenId: lastTokenId } = data || {};
  const { submitWaitResult, getFee, feeFormatted, feeLoading } =
    useCreateMultipleTokens();
  const { uploadFile } = useFileUpload();

  const leftTokens = collection?.token_limit
    ? collection.token_limit - (collection?.tokens_count || 0) - tokens.length
    : 'unlimited';

  const handleSubmit = async () => {
    if (!collection || !selectedAccount) {
      return;
    }
    setIsLoadingSubmitResult(true);
    const uploadedTokens = await Promise.all(
      tokens.map(async (tokens) => ({
        ...tokens,
        ipfsCid: await uploadFile(tokens.image.file),
      })),
    );
    submitWaitResult({
      payload: {
        tokens: mapTokensToPayload(
          uploadedTokens,
          collection?.collection_id,
          selectedAccount?.address,
        ),
        collectionId: collection?.collection_id,
        address: selectedAccount.address,
      },
    }).then((res) => {
      res?.parsed?.forEach((token) => {
        setPayloadEntity({
          type: 'create-token',
          entityData: token,
          parsed: res?.parsed,
        });
      });

      info('NFT created successfully');
      navigate(
        `/${currentChain?.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
      );
    });
  };

  const onAddTokens = (files: File[]) => {
    if (leftTokens !== 'unlimited' && files.length > leftTokens) {
      files = files.slice(0, leftTokens);
    }
    const lastId =
      (tokens.sort(({ tokenId: idA }, { tokenId: idB }) => (idA > idB ? 1 : -1)).at(-1)
        ?.tokenId ||
        lastTokenId ||
        0) + 1;
    setTokens([
      ...tokens,
      ...files.map((file, index) => ({
        id: index + lastId,
        tokenId: index + lastId,
        image: {
          url: URL.createObjectURL(file),
          file,
        },
        attributes: [],
        isReady: false,
        isSelected: false,
      })),
    ]);
  };

  const onChangeCollection = (_collection: Collection) => {
    if (_collection === collection) {
      return;
    }
    if (!collection || tokens.length === 0) {
      setCollection(_collection);
      return;
    }
    setCollectionToSubmit(_collection);
    setDialog(CreateTokenDialog.changeCollection);
  };

  const selectedAll = () => {
    setTokens(tokens.map((token) => ({ ...token, isSelected: true })));
  };

  const deselectedAll = () => {
    setTokens(tokens.map((token) => ({ ...token, isSelected: false })));
  };

  const changeSelected = (selectedTokens: NewToken[]) => {
    setTokens(
      tokens.map((token) => {
        const selectedToken = selectedTokens.find(({ id }) => id === token.id);
        return selectedToken || token;
      }),
    );
  };

  const removeSelected = () => {
    setTokens(
      tokens
        .filter(({ isSelected }) => !isSelected)
        .map((token, index) => ({ ...token, tokenId: (lastTokenId || 0) + index + 1 })),
    );
  };

  const selected = useMemo(() => {
    return tokens.filter(({ isSelected }) => isSelected);
  }, [tokens]);

  const onConfirmDialog = () => {
    if (dialog === CreateTokenDialog.removeToken) {
      removeSelected();
      setDialog(undefined);
    }
    if (dialog === CreateTokenDialog.changeCollection) {
      setCollection(collectionToSubmit);
      setDialog(undefined);
    }
  };

  useEffect(() => {
    setTokens((tokens) =>
      tokens.map((token, index) => ({
        ...token,
        tokenId: (lastTokenId || 0) + index + 1,
      })),
    );
  }, [lastTokenId]);

  const isValid = useMemo(() => {
    return (
      !!collection &&
      tokens.length > 0 &&
      checkRequiredAttributes(tokens, collection.attributes_schema)
    );
  }, [tokens, collection]);

  return (
    <MainWrapper className="create-nft-page">
      <WrapperContentStyled>
        <CollectionBlock>
          <CollectionSuggest collection={collection} onChange={onChangeCollection} />
          <LeftTokensBlock>
            <Typography size="m" color="grey-500">
              Left tokens:{' '}
            </Typography>
            <Typography size="m" weight="bold">
              {leftTokens < 1000 ? leftTokens : 'over 1000'}
            </Typography>
            {leftTokens !== 'unlimited' && collection && (
              <ProgressBar
                filledPercent={100 - (leftTokens / collection.token_limit) * 100}
              />
            )}
          </LeftTokensBlock>
        </CollectionBlock>

        <TokenList
          tokenPrefix={collection?.token_prefix || ''}
          attributesSchema={collection?.attributes_schema || []}
          mode={collection?.mode}
          tokensLimit={collection?.token_limit}
          tokensStartId={lastTokenId}
          tokens={tokens}
          onChange={setTokens}
          onAddTokens={onAddTokens}
        />
        <ButtonGroup>
          <ConfirmBtn role="outlined" title="Select all" onClick={selectedAll} />
          <ConfirmBtn
            role="outlined"
            disabled={selected.length === 0}
            title="Deselect all"
            onClick={deselectedAll}
          />
          <ConfirmBtn
            role="outlined"
            disabled={selected.length === 0}
            title="Change selected"
            onClick={() => setDialog(CreateTokenDialog.editAttributes)}
          />
          <ConfirmBtn
            role="danger"
            disabled={selected.length === 0}
            title="Remove selected"
            onClick={() => setDialog(CreateTokenDialog.removeToken)}
          />
          <div style={{ flex: 1 }} />
          <ConfirmBtn
            disabled={!isValid}
            role="primary"
            title="Confirm and create all"
            onClick={handleSubmit}
          />
          {tokens.length > 0 && leftTokens > 0 && <UploadFAB onUpload={onAddTokens} />}
        </ButtonGroup>
      </WrapperContentStyled>

      <CreateTokensDialogs
        dialog={dialog}
        tokens={selected}
        tokenPrefix={collection?.token_prefix || ''}
        attributesSchema={collection?.attributes_schema}
        mode={collection?.mode}
        onClose={() => setDialog(undefined)}
        onChange={changeSelected}
        onConfirm={onConfirmDialog}
      />
      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Creating tokens"
      />
    </MainWrapper>
  );
};

export const MainWrapper = styled.div`
  @media screen and (min-width: 1025px) {
    display: flex;
    align-items: flex-start;
  }

  .unique-modal-content-wrapper {
    max-width: fit-content;
    width: auto;
  }
`;

const CollectionBlock = styled.div`
  display: flex;
  gap: var(--prop-gap);
  align-items: center;
  max-width: 1000px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LeftTokensBlock = styled.div`
  text-wrap: nowrap;
  div[class^='ProgressBar__Bar'] {
    width: auto;
  }
`;

const WrapperContentStyled = styled(WrapperContent)`
  margin-bottom: calc(var(--prop-gap) * 2.5);

  @media screen and (min-width: 1025px) {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--prop-gap);
  box-sizing: border-box;
  padding: calc(var(--prop-gap) * 2);
  margin: -32px;
  bottom: 0px;
  z-index: 1001;
  background: white;
  position: sticky;
  border-radius: 4px;
  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    & > div {
      display: none;
    }
    & > button:last-of-type {
      grid-column: 1 / span 2;
    }
  }
  @media screen and (max-width: 568px) {
    padding: var(--prop-gap) 0;
    gap: calc(var(--prop-gap) / 2);

    margin: 0;
    & > button.unique-button.size-middle {
      padding: 8px 16px;
    }
  }
`;

export const CreateNFTv2 = withPageTitle({
  header: 'Create tokens',
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(CreateNFTv2Component);
