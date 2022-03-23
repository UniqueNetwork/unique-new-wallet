import React, { FC, useContext, useMemo } from 'react';

import { NFTToken } from '../../../api/chainApi/unique/types';
import { Offer } from '../../../api/restApi/offers/types';
import accountContext from '../../../account/AccountContext';
import { SellToken } from '../SellToken/SellToken';
import { BuyToken } from '../BuyToken/BuyToken';
import Auction from '../Auction/Auction';
import { isTokenOwner } from '../../../api/chainApi/utils/addressUtils';

interface TokenTradingProps {
  token: NFTToken
  offer?: Offer
  onSellClick(): void
  onBuyClick(): void
  onTransferClick(): void
  onPlaceABidClick(): void
  onDelistClick(): void
  onDelistAuctionClick(): void
  onWithdrawClick(): void
}

export const TokenTrading: FC<TokenTradingProps> = ({ token, offer, onSellClick, onTransferClick, onDelistClick, onDelistAuctionClick, onPlaceABidClick, onWithdrawClick, onBuyClick }) => {
  const { selectedAccount } = useContext(accountContext);

  const isOwner = useMemo(() => {
    if (!selectedAccount || !token.owner) return false;
    if (offer) {
      return isTokenOwner(selectedAccount.address, { Substrate: offer.seller });
    }
    return isTokenOwner(selectedAccount.address, token.owner);
  }, [selectedAccount, token, offer]);

  if (offer?.auction) {
    return (<Auction
      offer={offer}
      token={token}
      onPlaceABidClick={onPlaceABidClick}
      onWithdrawClick={onWithdrawClick}
      onDelistAuctionClick={onDelistAuctionClick}
    />);
  }

  if (isOwner) {
    return (<SellToken
      offer={offer}
      onSellClick={onSellClick}
      onTransferClick={onTransferClick}
      onDelistClick={onDelistClick}
    />);
  }

  return (
    <BuyToken offer={offer} onBuyClick={onBuyClick}/>
  );
};
