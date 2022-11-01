import { ReactNode } from 'react';
import { Avatar } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { NFTDetailsHeader } from '@app/pages/NFTDetails/components/NFTDetailsHeader';
import { Divider } from '@app/pages/NFTDetails/components/Divider';
import { TokenInformation } from '@app/pages/NFTDetails/components/TokenInformation';
import { TNFTModalType } from '@app/pages/NFTDetails/Modals';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { TooltipWrapper } from '@app/components';

type Props<T extends TBaseToken> = {
  token?: T;
  achievement?: string;
  onCurrentModal: (type: TNFTModalType) => void;
  isOwner: boolean;
  buttons: ReactNode;
  className?: string;
};

export const NftDetailsCard = <T extends TBaseToken>({
  token,
  onCurrentModal,
  achievement,
  isOwner,
  buttons,
  className,
}: Props<T>) => (
  <NftDetailsInfo className={className}>
    <div className="avatar">
      {achievement && (
        <span className="achievement">
          <TooltipWrapper
            message={
              <>
                A&nbsp;group of&nbsp;tokens nested in&nbsp;an&nbsp;NFT and having
                a&nbsp;nested, ordered, tree-like structure
              </>
            }
          >
            {achievement}
          </TooltipWrapper>
        </span>
      )}
      <Avatar fit="contain" src={token?.image?.fullUrl || undefined} />
    </div>
    <div className="info-container">
      <NFTDetailsHeader
        title={token?.name}
        tokenId={token?.tokenId}
        collectionId={token?.collectionId}
        collectionName={token?.collectionName}
        ownerAddress={token?.owner}
        isCurrentAccountOwner={isOwner}
        buttons={buttons}
        onShowModal={onCurrentModal}
      />
      <Divider />
      <TokenInformation token={token} />
    </div>
  </NftDetailsInfo>
);

const NftDetailsInfo = styled.div`
  --page-gap: calc(var(--prop-gap) * 1.5);

  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: var(--page-gap);
  max-width: 100%;

  .achievement {
    background: var(--color-additional-light);
    border: 1px solid var(--color-blue-grey-200);
    border-radius: var(--prop-border-radius);
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 16px;
    font-weight: 500;
    z-index: 2;
    cursor: default;

    & > span {
      padding: 4px 8px;
    }
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    flex-wrap: nowrap;
    max-width: none;
    margin: 0;
  }

  &:not(._empty) {
    align-items: flex-start;
  }

  &__loader {
    margin: auto;
  }

  .avatar {
    overflow: hidden;
    border-radius: calc(var(--prop-border-radius) * 2);
    position: relative;
    flex: 0 0 auto;
    width: 100%;
    background-color: var(--color-blue-grey-100);
    transform: translateZ(0);

    @media screen and (min-width: 768px) {
      flex: 0 0 30%;
      max-width: 536px;
    }

    @media screen and (min-width: 1024px) {
      flex: 0 0 34%;
    }

    @media screen and (min-width: 1280px) {
      flex: 3 0 0;
    }

    &::before {
      display: block;
      padding-bottom: 100%;
      content: '';
    }

    & > img {
      border-radius: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      transform: translate3d(-50%, -50%, 0);
    }
  }

  .info-container {
    flex: 1 1 auto;
    max-width: 100%;

    @media screen and (min-width: 320px) {
      width: 100%;
    }

    @media screen and (min-width: 768px) {
      flex: 0 0 calc(70% - var(--page-gap));
      max-width: calc(70% - var(--page-gap));
    }

    @media screen and (min-width: 1024px) {
      max-width: calc(66% - var(--page-gap));
    }

    @media screen and (min-width: 1280px) {
      flex: 4.5 0 0;
      max-width: none;
    }
  }
`;
