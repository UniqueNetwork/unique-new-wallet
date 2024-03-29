import { ReactNode } from 'react';
import styled from 'styled-components';

import { ExternalLink, Image, Typography } from '@app/components';
import { TBaseToken } from '@app/pages/TokenDetails/type';
import { TokenDetailsHeader } from '@app/pages/TokenDetails/components/TokenDetailsHeader';
import { Divider } from '@app/pages/TokenDetails/components/Divider';
import { TokenInformation } from '@app/pages/TokenDetails/components/TokenInformation';
import { TTokenModalType } from '@app/pages/TokenDetails/Modals';
import { FractionalInformation } from '@app/pages/TokenDetails/components/FractionalInformation';
import { useApi } from '@app/hooks';
import { getTokenIpfsUriByImagePath } from '@app/utils';

type Props<T extends TBaseToken> = {
  token?: T;
  achievement?: ReactNode;
  onCurrentModal: (type: TTokenModalType) => void;
  buttons: ReactNode;
  className?: string;
  owner: ReactNode;
  isFractional?: boolean;
  pieces?: number;
  balance?: number;
  canBurn: boolean;
  burnModal: TTokenModalType;
};

export const TokenDetailsCard = <T extends TBaseToken>({
  token,
  onCurrentModal,
  achievement = null,
  buttons,
  className,
  owner,
  isFractional,
  pieces,
  balance,
  canBurn,
  burnModal,
}: Props<T>) => {
  const { currentChain } = useApi();
  return (
    <NftDetailsInfo className={className}>
      <div className="avatar">
        {achievement}
        <Image alt={token?.name || ''} image={token?.image?.fullUrl || undefined} />
        {token?.video && (
          <VideoStyled
            playsInline
            src={token.video.fullUrl || undefined}
            poster={token.image.fullUrl || undefined}
            controls={true}
            autoPlay={false}
            loop={true}
            muted={false}
          />
        )}
        {token?.audio && (
          <AudioStyled
            src={token.audio.fullUrl || undefined}
            controls={true}
            autoPlay={false}
            loop={false}
            muted={false}
          />
        )}
      </div>
      <div className="info-container">
        <TokenDetailsHeader
          title={token?.name}
          tokenId={token?.tokenId}
          collectionId={token?.collectionId}
          collectionName={token?.collectionName}
          collectionCoverUrl={getTokenIpfsUriByImagePath(
            token?.collection?.schema?.coverPicture.fullUrl,
          )}
          buttons={buttons}
          owner={owner}
          canBurn={canBurn}
          burnModal={burnModal}
          onShowModal={onCurrentModal}
        />
        <Divider />
        <ScanLinksWrapper>
          <ExternalLink
            title="Collection on UniqueScan"
            href={`${currentChain.uniquescanAddress}/collections/${token?.collectionId}`}
          >
            <Typography color="primary-500">Collection on UniqueScan</Typography>
          </ExternalLink>
          <ExternalLink
            title="Token on UniqueScan"
            href={`${currentChain.uniquescanAddress}/tokens/${token?.collectionId}/${token?.tokenId}`}
          >
            <Typography color="primary-500">Token on UniqueScan</Typography>
          </ExternalLink>
        </ScanLinksWrapper>
        {isFractional && (
          <>
            <Divider />
            <FractionalInformation balance={balance} pieces={pieces} />
          </>
        )}
        <Divider />
        <TokenInformation token={token} />
      </div>
    </NftDetailsInfo>
  );
};

const NftDetailsInfo = styled.div`
  --page-gap: calc(var(--prop-gap) * 1.5);

  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: var(--page-gap);
  max-width: 100%;

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
    position: relative;
    flex: 0 0 auto;
    width: 100%;

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
  }

  .info-container {
    overflow: hidden;
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

const VideoStyled = styled.video`
  width: 100%;
  margin-top: 1rem;
`;

const AudioStyled = styled.audio`
  width: 100%;
  margin-top: 1rem;
  @media (max-width: 767px) {
    height: 100%;
  }
`;

const ScanLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(var(--prop-gap) / 2);
`;
