import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useApi } from '../../hooks/useApi';
import { NFTToken } from '../../api/chainApi/unique/types';
import { MinterType } from '../../types/MinterTypes';
import { CommonTokenDetail } from './TokenDetail/CommonTokenDetail';
import { useOffer } from '../../api/restApi/offers/offer';
import { TokenTrading } from './TokenDetail/TokenTrading';
import { Error404 } from '../errors/404';
import Loading from '../../components/Loading';
import TokenPageModal from './Modals/TokenPageModal';
import { PagePaper } from '../../components/PagePaper/PagePaper';

const TokenPage = () => {
  const { api } = useApi();
  const { id, collectionId } =
    useParams<{ id: string; collectionId: string }>();
  const [token, setToken] = useState<NFTToken>();
  const [loading, setLoading] = useState<boolean>(true);
  const { offer, fetch: fetchOffer } = useOffer(
    Number(collectionId),
    Number(id)
  );
  const [minterType, setMinterType] = useState<MinterType>(MinterType.default); // TODO: when "sell"/"buy"/"bid"/etc clicked - update this status to open modal

  const fetchToken = useCallback(() => {
    if (!api) return;
    setLoading(true);
    api?.nft
      ?.getToken(Number(collectionId), Number(id))
      .then((token: NFTToken) => {
        setToken(token);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Get token from RPC failed', error);
      });
  }, [api, collectionId, id]);

  // TODO: debug purposes, should be taken from API instead of RPC
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const onFinish = useCallback(() => {
    setMinterType(MinterType.default);
    fetchToken();
    fetchOffer(Number(collectionId), Number(id));
  }, [fetchOffer, fetchToken, collectionId, id]);

  const onActionClick = useCallback(
    (action: MinterType) => () => {
      setMinterType(action);
    },
    []
  );

  if (loading) return <Loading />;
  else if (!token) return <Error404 />;

  // TODO: split into more categories here instead of just "buy/sell" and putting splitting inside them

  return (
    <PagePaper>
      <CommonTokenDetail token={token}>
        <TokenTrading
          token={token}
          offer={offer}
          onSellClick={onActionClick(MinterType.sellFix)}
          onBuyClick={onActionClick(MinterType.purchase)}
          onTransferClick={onActionClick(MinterType.transfer)}
          onDelistClick={onActionClick(MinterType.delist)}
          onDelistAuctionClick={onActionClick(MinterType.delistAuction)}
          onPlaceABidClick={onActionClick(MinterType.bid)}
          onWithdrawClick={onActionClick(MinterType.withdrawBid)}
        />
        <TokenPageModal
          token={token}
          offer={offer}
          minterType={minterType}
          onFinish={onFinish}
        />
      </CommonTokenDetail>
    </PagePaper>
  );
};

export default TokenPage;
