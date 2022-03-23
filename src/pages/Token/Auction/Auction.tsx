import React, { FC, useCallback, useMemo, useState } from 'react';
import { Text, Button, Heading } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { Offer } from '../../../api/restApi/offers/types';
import { NFTToken } from '../../../api/chainApi/unique/types';
import Bids from './Bids';
import { Icon } from '../../../components/Icon/Icon';
import clock from '../../../static/icons/clock.svg';
import { timeDifference } from '../../../utils/timestampUtils';
import { AdditionalPositive100, AdditionalPositive500, Coral100, Coral500, Grey300 } from '../../../styles/colors';
import { useBidsSubscription } from '../../../hooks/useBidsSubscription';
import { Price } from '../TokenDetail/Price';
import { useFee } from '../../../hooks/useFee';
import { shortcutText } from '../../../utils/textUtils';
import { useAccounts } from '../../../hooks/useAccounts';
import { compareEncodedAddresses, isTokenOwner } from '../../../api/chainApi/utils/addressUtils';

interface AuctionProps {
  offer: Offer
  token: NFTToken
  onPlaceABidClick(): void
  onDelistAuctionClick(): void
  onWithdrawClick(): void
}

const Auction: FC<AuctionProps> = ({ offer: initialOffer, token, onPlaceABidClick, onDelistAuctionClick, onWithdrawClick }) => {
  const { fee } = useFee();

  const [offer, setOffer] = useState<Offer>(initialOffer);
  const { selectedAccount } = useAccounts();

  const canPlaceABid = useMemo(() => {
    return true; // TODO: get a balance of selected account
  }, []);

  const canDelist = useMemo(() => {
    if (!selectedAccount || !offer?.seller) return false;
    return isTokenOwner(selectedAccount.address, { Substrate: offer.seller }) && !offer.auction?.bids.length;
  }, [offer, selectedAccount]);

  const isBidder = useMemo(() => {
    if (!selectedAccount) return false;
    return offer.auction?.bids.some((bid) => compareEncodedAddresses(bid.bidderAddress, selectedAccount.address));
  }, [offer, selectedAccount]);

  const topBid = useMemo(() => {
    if (offer.auction?.bids.length === 0) return null;
    return offer.auction?.bids.reduce((top, bid) => {
      return top.amount > bid.amount ? top : bid;
    }) || null;
  }, [offer]);

  const isTopBidder = useMemo(() => {
    if (!selectedAccount || !isBidder || !topBid) return false;
    return compareEncodedAddresses(topBid.bidderAddress, selectedAccount.address);
  }, [isBidder, topBid, selectedAccount]);

  const canWithdraw = useMemo(() => {
    if (!selectedAccount) return false;
    return isBidder && !isTopBidder;
  }, [isBidder, isTopBidder, selectedAccount]);

  const onPlaceBid = useCallback((_offer: Offer) => {
    setOffer(_offer);
  }, [setOffer]);

  useBidsSubscription({ offer, onPlaceBid });

  return (<>
    <Price price={offer.price} fee={fee} bid={topBid?.amount} />
    <AuctionWrapper>
      <Row>
        {canDelist && <Button title={'Delist'}
          role={'danger'}
          onClick={onDelistAuctionClick}
          disabled={!canPlaceABid}
        />}
        {!canDelist && <Button title={'Place a bid'}
          role={'primary'}
          onClick={onPlaceABidClick}
          disabled={!canPlaceABid}
        />}
        {canWithdraw && <Button title={'Withdraw'} onClick={onWithdrawClick} />}

        <TimeLimitWrapper>
          <Icon path={clock} />
          <Text color={'dark'}>{`${timeDifference(new Date(offer.auction?.stopAt || '').getTime() / 1000)} left`}</Text>
        </TimeLimitWrapper>

      </Row>
      <Divider />
      <Heading size={'4'}>Offers</Heading>
      {isTopBidder && <TopBidderTextStyled >You are Top Bidder</TopBidderTextStyled>}
      {!isTopBidder && isBidder && <Row><BidderTextStyled >You are outbid</BidderTextStyled> <Text>{`Leading bid ${shortcutText(topBid?.bidderAddress || '')}`}</Text></Row>}
      <Bids offer={offer} />
    </AuctionWrapper>
  </>);
};

export default Auction;

const AuctionWrapper = styled.div`
  margin-top: 24px;
`;

const TimeLimitWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--gap)
`;

const Divider = styled.div`
  margin: 24px 0;
  border-top: 1px dashed ${Grey300};
`;

const TopBidderTextStyled = styled(Text)`
  margin-top: calc(var(--gap) / 2);
  box-sizing: border-box;
  display: flex;
  padding: 8px 16px;
  margin-bottom: 24px;
  border-radius: 4px;
  background-color: ${AdditionalPositive100};
  color: ${AdditionalPositive500} !important;
  width: fit-content;
`;

const BidderTextStyled = styled(Text)`  
  margin-top: calc(var(--gap) / 2);
  box-sizing: border-box;
  display: flex;
  padding: 8px 16px;
  margin-bottom: 24px;
  border-radius: 4px;
  background-color: ${Coral100};
  color: ${Coral500} !important;
  width: fit-content;
`;
