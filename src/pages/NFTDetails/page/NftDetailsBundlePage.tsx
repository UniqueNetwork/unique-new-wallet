import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Heading, Text } from '@unique-nft/ui-kit';
import classNames from 'classnames';
import { TokenByIdResponse } from '@unique-nft/sdk';

import { NftDetailsLayout } from '@app/pages/NFTDetails/components/NftDetailsLayout';
import { NftDetailsCard } from '@app/pages/NFTDetails/components/NftDetailsCard';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';
import { useCollectionGetById, useTokenGetBundle, useTokenGetById } from '@app/api';
import BundleTree from '@app/components/BundleTree/BundleTree';
import NodeView from '@app/components/BundleTree/Node/NodeView';
import { INestingToken } from '@app/components/BundleTree/types';
import { NestedSection } from '@app/components/BundleTree/NestedSection/NestedSection';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { useIsOwner } from '@app/pages/NFTDetails/hooks/useIsOwner';
import { countNestedChildren } from '@app/components/BundleTree/helpers-bundle';
import { TransferBtn } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { NftDetailsWrapperButtons } from '@app/pages/NFTDetails/components';

const areNodesEqual = (a: INestingToken, b: INestingToken) =>
  a.collectionId === b.collectionId && a.tokenId === b.tokenId;

const getKey = (a: INestingToken) => `T${a.tokenId}C${a.collectionId}`;

const addIsCurrentAccountOwnerToBundleAndSort = (
  bundle: INestingToken,
  isOwner: boolean,
) => {
  bundle.isCurrentAccountOwner = isOwner;
  if (bundle.nestingChildTokens?.length === 0) {
    return bundle;
  }
  bundle.opened = false;
  bundle.nestingChildTokens = bundle.nestingChildTokens
    ?.sort((a, b) => (a.tokenId > b.tokenId ? 1 : -1))
    .map((bundleToken) => {
      return addIsCurrentAccountOwnerToBundleAndSort(bundleToken, isOwner);
    });

  return bundle;
};

export const NftDetailsBundlePage = () => {
  const { collectionId = '', tokenId = '' } = useParams();
  const navigate = useNavigate();
  const { currentChain } = useApi();
  const size = useDeviceSize();

  const [bundle, setBundle] = useState<INestingToken[]>([]);

  const [currentModal, setCurrentModal] = useState<TNFTModalType>('none');

  const [isShowBundleTreeMobile, setShowBundleTreeMobile] = useState(false);

  const [selectedTokenBundleTable, setSelectedTokenBundleTable] =
    useState<INestingToken | null>(null);

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

  const {
    data: collection,
    isLoading: isLoadingCollection,
    refetch: refetchCollection,
  } = useCollectionGetById(parseInt(collectionId));

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
      name: collection ? `${collection.tokenPrefix} #${tokenById.tokenId}` : '',
      collectionName: collection?.name || '',
    };
  }, [tokenById, collection]);

  const isOwner = useIsOwner(bundleToken);

  useEffect(() => {
    if (!bundleToken) {
      return;
    }
    setBundle([addIsCurrentAccountOwnerToBundleAndSort(bundleToken, isOwner)]);
  }, [bundleToken, isOwner]);

  const onModalClose = () => {
    setCurrentModal('none');
    setSelectedTokenBundleTable(null);
  };

  const onComplete = () => {
    refetchToken();
    refetchBundle();
    refetchCollection();
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

  return (
    <NftDetailsWrapper
      className={classNames({
        hidden: isShowBundleTreeMobile && size === DeviceSize.xs,
      })}
    >
      <NftDetailsLayout
        isLoading={isLoadingBundleToken || isLoadingToken || isLoadingCollection}
        tokenExist={!!bundleToken && !!token}
      >
        <NftDetailsCard
          className="nft-details-card"
          token={token}
          isOwner={isOwner}
          achievement={isBundleToken() ? 'Bundle' : 'Nested'}
          buttons={
            isOwner && (
              <NftDetailsWrapperButtons>
                <TransferBtn
                  className="transfer-btn"
                  wide={size === DeviceSize.xs}
                  title="Transfer"
                  role="primary"
                  onClick={transferTokenAction}
                />
                {!isBundleToken() && (
                  <TransferBtn
                    wide={size === DeviceSize.xs}
                    title="Unnest Token"
                    role="danger"
                    onClick={unnestTokenAction}
                  />
                )}
              </NftDetailsWrapperButtons>
            )
          }
          onCurrentModal={setCurrentModal}
        />

        <BundleWrapper>
          <HeaderStyled>
            <Heading size="2">Bundle tree structure</Heading>
            <Text color="grey-500" size="m" className="tokens-count">
              {tokensCount + 1} items total
            </Text>
          </HeaderStyled>
          <BundleTree<INestingToken>
            dataSource={bundle || []}
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
        </BundleWrapper>

        <TreeMobileBtn className="tree-bundle-btn">
          <Button
            role="primary"
            wide={size === DeviceSize.xs}
            title={isShowBundleTreeMobile ? 'Back' : 'Show bundle tree structure'}
            onClick={() => setShowBundleTreeMobile((prev) => !prev)}
          />
        </TreeMobileBtn>

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

  @media screen and (max-width: 567px) {
    .nft-details-card,
    ${BundleWrapper} {
      padding-bottom: 75px;
    }
  }
  &.hidden {
    .nft-details-card,
    .unique-breadcrumbs-wrapper {
      display: none;
    }

    .tree-container {
      height: auto;
      overflow: inherit;
    }

    ${BundleWrapper} {
      display: block;
      margin-top: -70px;
      background: var(--color-additional-light);
    }

    ${HeaderStyled} {
      flex-direction: column;
      gap: inherit;
      margin-bottom: 24px;

      h2 {
        margin-bottom: 0;
        font-size: 24px;
      }

      .tokens-count {
        margin-top: 0;
      }
    }
  }
`;

const TreeMobileBtn = styled.div`
  display: none;

  @media screen and (max-width: 567px) {
    &.tree-bundle-btn {
      background: var(--color-additional-light);
      z-index: 49;
      display: block;
      height: auto;
      line-height: inherit;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px;
      box-sizing: border-box;
    }
  }
`;
