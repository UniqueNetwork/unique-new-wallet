import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { CreateTokenPayload } from '@unique-nft/sdk';

import { useAccounts, useApi } from '@app/hooks';
import { ConfirmBtn, Heading, Typography, useNotifications } from '@app/components';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { ROUTE, MY_TOKENS_TABS_ROUTE } from '@app/routes';
import { Collection } from '@app/api/graphQL/types';
import {
  useCollectionGetById,
  useCollectionGetLastTokenId,
  useCreateMultipleTokens,
  useExtrinsicCacheEntities,
  useFileUpload,
} from '@app/api';
import { sleep } from '@app/utils';

import { WrapperContent } from '../components/PageComponents';
import { CollectionSuggest } from './components/CollectionSuggest';
import { TokenList } from './components/TokenList';
import { CreateTokenDialog, NewToken } from './types';
import { CreateTokensDialogs } from './components/CreateTokensDialogs';
import {
  checkRequiredAttributes,
  mapTokensToPayload,
  mapTokensToPayload$1,
} from './helpers';
import { UploadFAB } from './components/UploadFAB';
import { CollectionStats } from './components/CollectionStats';
import { StatusTransactionModal } from './components/StatusTransactionModal';

const MAX_MINT_TOKENS = 300;

export const CreateNFTv2Component: FC<{ className?: string }> = ({ className }) => {
  const [collection, setCollection] = useState<Collection>();
  const [collectionToSubmit, setCollectionToSubmit] = useState<Collection>();
  const collectionBlockRef = useRef<HTMLDivElement>(null);

  const [tokens, setTokens] = useState<NewToken[]>([]);
  const [dialog, setDialog] = useState<CreateTokenDialog>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState<boolean>(false);

  const [stage, setStage] = useState<'uploading' | 'minting'>('uploading');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [mintingProgress, setMintingProgress] = useState<number>(0);
  const [batchSize, setBatchSize] = useState<number>(30);

  const { currentChain, api } = useApi();

  const navigate = useNavigate();
  const { info, error } = useNotifications();
  const { setPayloadEntity } = useExtrinsicCacheEntities();
  const {
    selectedAccount,
    accounts: { size: accountsLength },
  } = useAccounts();
  const { data: lastTokenIdDto, isFetching: isFetchingLastTokenId } =
    useCollectionGetLastTokenId(collection?.collection_id);
  const { data: collectionInfo, isFetching: isFetchingInfo } = useCollectionGetById(
    collection?.collection_id,
  );
  const { tokenId: lastTokenId } = lastTokenIdDto || {};

  const { submitWaitResult, getFee, feeFormatted, feeLoading } =
    useCreateMultipleTokens();
  const { uploadFile } = useFileUpload();

  const leftTokens = collection?.token_limit
    ? collection.token_limit - (collection?.tokens_count || 0) - tokens.length
    : 'unlimited';

  const selected = useMemo(() => {
    return tokens.filter(({ isSelected }) => isSelected);
  }, [tokens]);

  const handleSubmit = async () => {
    if (!collection || !selectedAccount) {
      return;
    }
    setIsLoadingSubmitResult(true);
    setStage('uploading');
    const uploadedTokens: NewToken[] = [];
    try {
      for (let index = 0; index < tokens.length; index++) {
        setUploadProgress(index);
        sleep(100);
        const ipfsCid = await uploadFile(tokens[index].image.file);
        uploadedTokens.push({
          ...tokens[index],
          ipfsCid,
        });
      }
    } catch (e: any) {
      error(e.message);
    }
    setStage('minting');

    const createTokensPayload = mapTokensToPayload(
      uploadedTokens,
      collection?.collection_id,
      selectedAccount?.address,
    );

    let currentPos = 0;
    let batchSize = 30;
    const submitBatch = async (_tokens: CreateTokenPayload[]) => {
      return await submitWaitResult({
        payload: {
          tokens: _tokens,
          collectionId: collection?.collection_id,
          address: selectedAccount.address,
        },
      });
    };

    while (currentPos < createTokensPayload.length - 1) {
      try {
        await submitBatch(createTokensPayload.slice(currentPos, currentPos + batchSize));
        currentPos += batchSize;
        setMintingProgress(currentPos);
      } catch (e) {
        batchSize = 10;
        setBatchSize(batchSize);
      }
    }
    info('Tokens created successfully');
    navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
  };

  const onAddTokens = (files: File[]) => {
    const maxTokens = Math.min(
      MAX_MINT_TOKENS - tokens.length,
      leftTokens !== 'unlimited' ? leftTokens : MAX_MINT_TOKENS,
    );
    if (leftTokens !== 'unlimited' && files.length > maxTokens) {
      files = files.slice(0, maxTokens);
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
    info(`${files.length} files added`);
  };

  const onChangeCollection = (_collection: Collection) => {
    if (_collection === collection) {
      return;
    }
    if (!collection || tokens.length === 0) {
      setCollection(_collection);

      const rect = collectionBlockRef.current?.getBoundingClientRect();
      const top = rect?.top;
      window.scrollTo({ top, behavior: 'smooth' });
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
    info(`${selected.length} files removed`);
  };

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
      <WrapperCollectionContentStyled expanded={!!collection}>
        <Heading size="3">Choose a collection</Heading>
        <CollectionBlock ref={collectionBlockRef}>
          <CollectionSuggest collection={collection} onChange={onChangeCollection} />
          {collection && (
            <CollectionStats
              collection={collection}
              isFetching={isFetchingInfo || isFetchingLastTokenId}
              nestingPermissions={collectionInfo?.permissions?.nesting}
              sponsorship={collectionInfo?.sponsorship}
              tokensLeft={leftTokens}
              tokensLimit={collection.token_limit}
              lastTokenId={lastTokenId || 0}
            />
          )}
        </CollectionBlock>
      </WrapperCollectionContentStyled>
      <WrapperTokenListContentStyled disabled={!collection}>
        <Heading size="3">Create tokens</Heading>
        <Typography size="m" color="grey-500">
          You can mass-mint tokens using JPEG, PNG, and GIF files, with a maximum size of
          10MB each
        </Typography>
        {tokens.length > 0 && (
          <TokensCounterWrapper>
            <Typography color="grey-500" weight="bold" size="m">
              {tokens.length} / {MAX_MINT_TOKENS}
            </Typography>
          </TokensCounterWrapper>
        )}
        <TokenList
          tokenPrefix={collection?.token_prefix || ''}
          attributesSchema={collection?.attributes_schema || []}
          mode={collection?.mode}
          tokensLimit={collection?.token_limit}
          tokensStartId={lastTokenId}
          tokens={tokens}
          disabled={!collection}
          onChange={setTokens}
          onAddTokens={onAddTokens}
        />
        {!!collection && (
          <ButtonGroup>
            <ConfirmBtn
              role="outlined"
              disabled={tokens.length === 0}
              title="Select all"
              onClick={selectedAll}
            />
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
            <SelectedCountWrapper>
              {selected.length > 0 && (
                <Typography color="grey-500">{selected.length} selected</Typography>
              )}
            </SelectedCountWrapper>
            <ConfirmBtn
              disabled={!isValid}
              role="primary"
              title="Confirm and create all"
              onClick={handleSubmit}
            />
            {tokens.length > 0 && leftTokens > 0 && <UploadFAB onUpload={onAddTokens} />}
          </ButtonGroup>
        )}
      </WrapperTokenListContentStyled>

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
        stage={stage}
        uploadingProgress={uploadProgress}
        mintingProgress={mintingProgress}
        totalTokens={tokens.length}
        batchSize={batchSize}
      />
    </MainWrapper>
  );
};

export const MainWrapper = styled.div`
  @media screen and (min-width: 1025px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .unique-modal-content-wrapper {
    max-width: fit-content;
    width: auto;
  }
`;

const CollectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--prop-gap);
  align-items: flex-start;
  max-width: 1000px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const WrapperCollectionContentStyled = styled(WrapperContent)<{ expanded: boolean }>`
  margin-bottom: calc(var(--prop-gap) * 2.5);
  width: 100%;
  max-height: ${({ expanded }) => (expanded ? '1000px' : '154px')};
  transition: 0.5s;
  @media screen and (min-width: 1025px) {
    margin-bottom: 0;
  }
`;

const WrapperTokenListContentStyled = styled(WrapperContent)<{ disabled: boolean }>`
  margin: calc(var(--prop-gap) * 2) 0;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? '0.7' : '1')};
  position: relative;
  transition: 0.5s;
  h3.unique-font-heading.size-3 {
    margin-bottom: 0;
  }
  @media screen and (min-width: 1025px) {
    margin-bottom: 0;
  }
`;

const TokensCounterWrapper = styled.div`
  position: absolute;
  right: 32px;
  top: 32px;

  @media screen and (max-width: 1024px) {
    top: 8px;
    right: 0px;
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

const SelectedCountWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const CreateNFTv2 = withPageTitle({
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(CreateNFTv2Component);
