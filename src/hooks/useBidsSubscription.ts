import { useContext, useEffect, useRef } from 'react';

import { Offer } from '../api/restApi/offers/types';
import AuctionContext from '../api/restApi/auction/AuctionContext';

type useBidsSubscriptionProps = {
  offer: Offer,
  onPlaceBid(offer: Offer): void
};

export const useBidsSubscription = ({ offer, onPlaceBid }: useBidsSubscriptionProps) => {
  const { socket } = useContext(AuctionContext);
  const offerRef = useRef<Offer>();

  useEffect(() => {
    if (!offer || !socket) return;
    if (offerRef.current !== offer) {
      socket?.emit('unsubscribeToAuction', offerRef.current);
      offerRef.current = offer;
    }
    socket?.emit('subscribeToAuction', {
      collectionId: offer.collectionId,
      tokenId: offer.tokenId
    });

    socket?.on('bidPlaced', (offer) => {
      console.log('bidPlaced', offer);
      onPlaceBid(offer);
    });

    return () => {
      socket?.emit('unsubscribeToAuction', offer);
    };
  }, [socket, offer]);

  return {};
};
