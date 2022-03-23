import { useCallback, useState } from 'react';

import { post, deleteRequest } from '../base';
import { defaultParams } from '../base/axios';

const endpoint = '/auction';

export enum FetchStatus {
  default = 'Default',
  inProgress = 'InProgress',
  success = 'Success',
  error = 'Error'
}

export type TStartAuctionParams = {
  tx: unknown, days: number, startPrice: string, priceStep: string
}

export type TPlaceBidParams = {
  tx: unknown, collectionId: number, tokenId: number
}

export type TDeleteParams = {
  collectionId: number, tokenId: number, timestamp: number
}

export type TSignature = {
  signature: string,
  signer: string
}

export const startAuction = (body: TStartAuctionParams) => post<TStartAuctionParams>(`${endpoint}/create_auction`, body, { ...defaultParams });
export const placeBid = (body: TPlaceBidParams) => post<TPlaceBidParams>(`${endpoint}/place_bid`, body, { ...defaultParams });
export const withdrawBid = (body: TDeleteParams, { signer, signature }: TSignature) => deleteRequest(`${endpoint}/withdraw_bid`, { headers: { ...defaultParams.headers, Authorization: `${signer}:${signature}` }, params: body, ...defaultParams });
export const cancelAuction = (body: TDeleteParams, { signer, signature }: TSignature) => deleteRequest(`${endpoint}/cancel_auction`, { headers: { ...defaultParams.headers, Authorization: `${signer}:${signature}` }, params: body, ...defaultParams });

export const useAuction = () => {
  const [startAuctionStatus, setStartAuctionStatus] = useState<FetchStatus>(FetchStatus.default);
  const [placeBidStatus, setPlaceBidStatus] = useState<FetchStatus>(FetchStatus.default);
  const startAuction = useCallback(async (params: TStartAuctionParams) => {
    try {
      setStartAuctionStatus(FetchStatus.inProgress);
      await startAuction(params);
      setStartAuctionStatus(FetchStatus.success);
    } catch (e) {
      setStartAuctionStatus(FetchStatus.error);
      console.error('Failed to create auction', e);
    }
  }, []);

  const placeBid = useCallback(async (params: TPlaceBidParams) => {
    try {
      setPlaceBidStatus(FetchStatus.inProgress);
      await placeBid(params);
      setPlaceBidStatus(FetchStatus.success);
    } catch (e) {
      setPlaceBidStatus(FetchStatus.error);
      console.error('Failed to create auction', e);
    }
  }, []);

  return {
    startAuction,
    placeBid,
    startAuctionStatus,
    placeBidStatus
  };
};
