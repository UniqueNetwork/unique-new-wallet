import React, { FC, useMemo, useState } from 'react';
import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { useAccounts, useApi } from '@app/hooks';
import { NFTToken } from '@app/api/chainApi/unique/types';
import { formatKusamaBalance } from '@app/utils/textUtils';
import { Offer } from '@app/api/restApi/offers/types';
import { Icon } from '@app/components';
import { compareEncodedAddresses } from '@app/api/chainApi/utils/addressUtils';
import { timeDifference } from '@app/utils/timestampUtils';

import Kusama from '../../static/icons/logo-kusama.svg';
import Loading from '../Loading';
import { Picture } from '..';
import config from '../../config';

export type TTokensCard = {
  offer: Offer;
};

export const OfferCard: FC<TTokensCard> = ({ offer }) => {
  const [token, setToken] = useState<NFTToken | undefined>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { api } = useApi();
  const { selectedAccount } = useAccounts();

  const { collectionName, imagePath, tokenPrefix } = useMemo<
    Record<string, string | undefined>
  >(() => {
    if (token) {
      return {
        collectionName: token.collectionName,
        imagePath: token.imageUrl,
        tokenPrefix: token.prefix,
      };
    }

    if (offer) {
      setIsFetching(true);
      void api?.nft
        ?.getToken(offer.collectionId, offer.tokenId)
        .then((token: NFTToken) => {
          setIsFetching(false);
          setToken(token);
        });
    }
    return {};
  }, [offer, token, api]);

  const isBidder = useMemo(() => {
    if (!selectedAccount) return false;
    return offer?.auction?.bids.some((bid) =>
      compareEncodedAddresses(bid.bidderAddress, selectedAccount.address),
    );
  }, [offer, selectedAccount]);

  const topBid = useMemo(() => {
    if (!offer?.auction?.bids?.length) return null;
    return (
      offer.auction.bids.reduce((top, bid) => {
        return top.amount > bid.amount ? top : bid;
      }) || null
    );
  }, [offer]);

  const isTopBidder = useMemo(() => {
    if (!selectedAccount || !isBidder || !topBid) return false;
    return compareEncodedAddresses(topBid.bidderAddress, selectedAccount.address);
  }, [isBidder, topBid, selectedAccount]);

  return (
    <TokensCardStyled>
      <PictureWrapper href={`/token/${offer?.collectionId}/${offer?.tokenId}`}>
        <Picture alt={offer?.tokenId?.toString() || ''} src={imagePath} />
      </PictureWrapper>
      <Description>
        <a
          href={`/token/${offer?.collectionId}/${offer?.tokenId}`}
          title={`${tokenPrefix || ''} #${offer?.tokenId}`}
        >
          <Text size="l" weight="medium" color={'secondary-500'}>
            {`${tokenPrefix || ''} #${offer?.tokenId}`}
          </Text>
        </a>
        <a
          href={`${config.scanUrl || ''}collections/${offer?.collectionId}`}
          target={'_blank'}
          rel="noreferrer"
        >
          <Text color="primary-600" size="s">
            {`${collectionName?.substring(0, 15) || ''} [id ${
              offer?.collectionId || ''
            }]`}
          </Text>
        </a>
        <PriceWrapper>
          <Text size="s">{`Price: ${formatKusamaBalance(offer?.price || 0)}`}</Text>
          <Icon path={Kusama} size={16} />
        </PriceWrapper>
        {!offer?.auction && (
          <Text size={'xs'} color={'grey-500'}>
            Price
          </Text>
        )}
        {offer?.auction && (
          <AuctionInfoWrapper>
            {isTopBidder && (
              <Text size={'xs'} color={'positive-500'}>
                Leading bid
              </Text>
            )}
            {isBidder && !isTopBidder && (
              <Text size={'xs'} color={'coral-500'}>
                Outbid
              </Text>
            )}
            {!isBidder && !isTopBidder && (
              <Text size={'xs'} color={'grey-500'}>
                {offer.auction.bids.length > 0 ? 'Last bid' : 'Minimum bid'}
              </Text>
            )}
            <Text color={'dark'} size={'xs'}>{`${timeDifference(
              new Date(offer.auction?.stopAt || '').getTime() / 1000,
            )} left`}</Text>
          </AuctionInfoWrapper>
        )}
      </Description>

      {isFetching && <Loading />}
    </TokensCardStyled>
  );
};

const TokensCardStyled = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const PictureWrapper = styled.a`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  .picture {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    color: white;
    text-align: center;
    max-height: 100%;
    border-radius: 8px;
    transition: 50ms;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    svg {
      border-radius: 8px;
    }

    &:hover {
      transform: translate(0, -5px);
      text-decoration: none;
    }
  }
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: var(--color-primary-600);

    &:nth-of-type(2) {
      margin-bottom: 5px;
    }
  }
`;

const AuctionInfoWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
`;
