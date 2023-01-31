import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Heading, Text } from '@unique-nft/ui-kit';
import { TokenByIdResponse } from '@unique-nft/sdk';

import { NftDetailsLayout } from '@app/pages/NFTDetails/components/NftDetailsLayout';
import { NftDetailsCard } from '@app/pages/NFTDetails/components/NftDetailsCard';
import { NFTModals, TTokenModalType } from '@app/pages/NFTDetails/Modals';
import { useTokenGetBundle, useTokenGetById } from '@app/api';
import BundleTree from '@app/components/BundleTree/BundleTree';
import NodeView from '@app/components/BundleTree/Node/NodeView';
import { INestingToken } from '@app/components/BundleTree/types';
import { NestedSection } from '@app/components/BundleTree/NestedSection/NestedSection';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { useIsOwner } from '@app/pages/NFTDetails/hooks/useIsOwner';
import { countNestedChildren } from '@app/components/BundleTree/helpers-bundle';
import { Achievement, Button, TransferBtn } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { BottomBar, BottomBarHeader } from '@app/pages/components/BottomBar';
import { menuButtonsNft } from '@app/pages/NFTDetails/page/constants';
import AccountCard from '@app/pages/Accounts/components/AccountCard';

const areNodesEqual = (a: INestingToken, b: INestingToken) =>
  a.collectionId === b.collectionId && a.tokenId === b.tokenId;

const getKey = (a: INestingToken) => `T${a.tokenId}C${a.collectionId}`;

export const NftDetailsBundlePage = () => {
  const { collectionId = '', tokenId = '' } = useParams();
  const navigate = useNavigate();
  const { currentChain } = useApi();
  const deviceSize = useDeviceSize();

  const [bundle, setBundle] = useState<INestingToken[]>([]);

  const [currentModal, setCurrentModal] = useState<TTokenModalType>('none');

  const [isShowBundleTreeMobile, setShowBundleTreeMobile] = useState(false);

  const [selectedTokenBundleTable, setSelectedTokenBundleTable] =
    useState<INestingToken | null>(null);

  const [selectedToken, setSelectedToken] = useState<INestingToken>();

  const {
    data: bundleToken,
    isLoading: isLoadingBundleToken,
    refetch: refetchBundle,
  } = useTokenGetBundle({
    collectionId: parseInt(collectionId),
    tokenId: parseInt(tokenId),
  });

  const {
    data: tokenById,
    isLoading: isLoadingToken,
    refetch: refetchToken,
  } = useTokenGetById({
    collectionId: parseInt(collectionId),
    tokenId: parseInt(tokenId),
  });

  const { data: parentToken, isLoading: isLoadingParentToken } = useTokenGetById({
    ...tokenById?.nestingParentToken,
  });

  const token:
    | (TokenByIdResponse & {
        collectionName: string;
        name: string;
      })
    | undefined = useMemo(() => {
    if (!tokenById) {
      return undefined;
    }
    return {
      ...tokenById,
      name: `${tokenById?.collection.tokenPrefix} #${tokenById.tokenId}`,
      collectionName: tokenById?.collection.name || '',
    };
  }, [tokenById]);

  const isOwner = useIsOwner(token);

  const onModalClose = () => {
    setCurrentModal('none');
    setSelectedTokenBundleTable(null);
  };

  const onComplete = () => {
    refetchToken();
    refetchBundle();
    setCurrentModal('none');
  };

  const handleNodeClicked = (data: INestingToken) => {
    console.log(data);
  };

  const handleViewTokenDetails = (token: INestingToken) => {
    navigate(`/${currentChain?.network}/token/${token.collectionId}/${token.tokenId}`);
  };

  const isBundleToken = () => {
    // @ts-ignore
    const nestingParentToken = bundleToken?.nestingChildTokens?.[0]?.nestingParentToken;

    if (!nestingParentToken) {
      return false;
    }

    return (
      nestingParentToken.collectionId === parseInt(collectionId) &&
      nestingParentToken.tokenId === parseInt(tokenId)
    );
  };

  useEffect(() => {
    setBundle([]);
  }, [bundleToken]);

  useEffect(() => {
    if (bundle.length) {
      return;
    }

    const sortTokensInBundleAndSelectOpened = (bundle: INestingToken) => {
      bundle.isCurrentAccountOwner = isOwner;
      if (
        bundle.tokenId === token?.tokenId &&
        bundle.collectionId === token.collectionId
      ) {
        bundle.selected = true;
        bundle.opened = true;
        setSelectedToken(bundle);
      }

      if (!bundle.nestingChildTokens?.length) {
        return bundle;
      }

      bundle.nestingChildTokens = bundle.nestingChildTokens
        ?.sort((a, b) => (a.tokenId > b.tokenId ? 1 : -1))
        .map((token) => sortTokensInBundleAndSelectOpened(token));
      return bundle;
    };

    const openNodeIfChildsPageOpened = (bundle: INestingToken) => {
      if (!bundle.nestingChildTokens?.length) {
        return (
          bundle.tokenId === token?.tokenId && bundle.collectionId === token.collectionId
        );
      }

      bundle.opened = !!bundle.nestingChildTokens.filter((token) =>
        openNodeIfChildsPageOpened(token),
      ).length;
      return bundle;
    };

    if (bundleToken && !isLoadingBundleToken) {
      let allowedToEditBundle = JSON.parse(JSON.stringify(bundleToken));
      allowedToEditBundle = sortTokensInBundleAndSelectOpened(allowedToEditBundle);
      allowedToEditBundle = openNodeIfChildsPageOpened(allowedToEditBundle);
      setBundle([allowedToEditBundle]);
    }
  }, [
    bundle,
    bundleToken,
    isLoadingBundleToken,
    token?.tokenId,
    token?.collectionId,
    isOwner,
  ]);

  const tokensCount = useMemo(() => {
    if (!bundle || !bundle[0]?.nestingChildTokens) {
      return 0;
    }
    return countNestedChildren(bundle[0].nestingChildTokens);
  }, [bundle]);

  const handleUnnestToken = (token: INestingToken) => {
    unnestTokenAction();
    setSelectedTokenBundleTable(token);
  };

  const unnestTokenAction = () => {
    logUserEvent(UserEvents.UNNEST_TOKEN);
    setCurrentModal('unnest');
  };

  const handleTransferToken = (token: INestingToken) => {
    transferTokenAction();
    setSelectedTokenBundleTable(token);
  };

  const transferTokenAction = () => {
    logUserEvent(UserEvents.TRANSFER_NFT);
    setCurrentModal('bundle-transfer');
  };

  const menuButtons = useMemo(() => {
    const items = [...menuButtonsNft];

    if (isOwner && (selectedToken?.nestingChildTokens?.length || 0) === 0) {
      items.push({
        icon: 'burn',
        id: 'burn',
        title: 'Burn token',
        type: 'danger',
      });
    }

    return items;
  }, [isOwner, selectedToken?.nestingChildTokens?.length]);

  const BundleTreeRendered = (
    <BundleTree<INestingToken>
      dataSource={bundle}
      selectedToken={selectedToken}
      nodeView={NodeView}
      nestedSectionView={NestedSection}
      className="tree-container"
      compareNodes={areNodesEqual}
      childrenProperty="nestingChildTokens"
      getKey={getKey}
      onNodeClicked={handleNodeClicked}
      onViewNodeDetails={handleViewTokenDetails}
      onUnnestClick={handleUnnestToken}
      onTransferClick={handleTransferToken}
    />
  );

  const owner = () => {
    const isBundle = isBundleToken();

    if (!isOwner && isBundle) {
      return (
        <>
          Owned by{' '}
          <AccountCard
            accountAddress={token?.owner || ''}
            canCopy={false}
            scanLink={`${currentChain.uniquescanAddress}/account/${token?.owner}`}
          />
        </>
      );
    }
    if (isOwner && isBundle) {
      return 'You own it';
    }
    return (
      <>
        Nested in bundle
        <TokenLink
          to={`/${currentChain?.network}/token/${parentToken?.collectionId}/${parentToken?.tokenId}`}
        >
          {parentToken?.collection.tokenPrefix} #{parentToken?.tokenId}
        </TokenLink>
      </>
    );
  };

  const renderAchievements = () => (
    <>
      <Achievement
        achievement={isBundleToken() ? 'Bundle' : 'Nested'}
        tooltipDescription={
          <>
            A&nbsp;group of&nbsp;tokens nested in&nbsp;an&nbsp;NFT and having
            a&nbsp;nested, ordered, tree-like structure
          </>
        }
      />
      {token?.collection.mode === 'ReFungible' && (
        <AchievementStyled
          achievement="Fractional"
          tooltipDescription={
            <>
              A&nbsp;fractional token provides a&nbsp;way for many users to&nbsp;own
              a&nbsp;part of&nbsp;an&nbsp;NFT
            </>
          }
        />
      )}
    </>
  );

  return (
    <NftDetailsWrapper>
      <NftDetailsLayout
        isLoading={isLoadingBundleToken || isLoadingToken || isLoadingParentToken}
        tokenExist={!!bundleToken && !!token}
      >
        <NftDetailsCard
          className="nft-details-card"
          token={token}
          owner={owner()}
          menuButtons={menuButtons}
          achievement={renderAchievements()}
          buttons={
            isOwner && (
              <>
                <TransferBtn
                  wide={deviceSize === DeviceSize.xs}
                  title="Transfer"
                  role="primary"
                  onClick={transferTokenAction}
                />
                {!isBundleToken() && (
                  <TransferBtn
                    wide={deviceSize === DeviceSize.xs}
                    title="Unnest Token"
                    role="danger"
                    onClick={unnestTokenAction}
                  />
                )}
              </>
            )
          }
          onCurrentModal={setCurrentModal}
        />

        {deviceSize >= DeviceSize.sm && (
          <BundleWrapper>
            <HeaderStyled>
              <Heading size="2">Bundle tree structure</Heading>
              <Text color="grey-500" size="m" className="tokens-count">
                {tokensCount + 1} items total
              </Text>
            </HeaderStyled>
            {BundleTreeRendered}
          </BundleWrapper>
        )}

        {deviceSize <= DeviceSize.xs && (
          <BottomBar
            buttons={[
              <Button
                key="show-bundle-tree"
                role="primary"
                wide={deviceSize === DeviceSize.xs}
                iconLeft={
                  isShowBundleTreeMobile
                    ? {
                        color: 'currentColor',
                        name: 'arrow-left',
                        size: 16,
                      }
                    : undefined
                }
                title={isShowBundleTreeMobile ? 'Back' : 'Show bundle tree structure'}
                onClick={() => setShowBundleTreeMobile((prev) => !prev)}
              />,
            ]}
            header={
              <BottomBarHeader showBackLink={false} title="Bundle tree structure">
                <Text color="grey-500" size="m" className="tokens-count">
                  {tokensCount + 1} items total
                </Text>
              </BottomBarHeader>
            }
            isOpen={isShowBundleTreeMobile}
            parent={document.body}
          >
            {BundleTreeRendered}
          </BottomBar>
        )}

        <NFTModals
          modalType={currentModal}
          token={selectedTokenBundleTable || token}
          onComplete={onComplete}
          onClose={onModalClose}
        />
      </NftDetailsLayout>
    </NftDetailsWrapper>
  );
};

const TokenLink = styled(Link)`
  color: var(--color-primary-500);

  &:hover {
    text-decoration: underline;
  }
`;

const BundleWrapper = styled.div`
  margin-top: calc(var(--prop-gap) * 1.5);

  @media screen and (max-width: 567px) {
    display: none;
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  gap: var(--gap);

  .tokens-count {
    margin-top: 12px;
    font-weight: normal;
    display: block;
  }
`;

const NftDetailsWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const AchievementStyled = styled(Achievement)`
  top: calc(var(--prop-gap) * 3) !important;
`;
