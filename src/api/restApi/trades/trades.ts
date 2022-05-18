import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { Api } from '@app/api/restApi/base';

import { ResponseError } from '../base/types';
import { GetTradesRequestPayload, Trade, UseFetchTradesProps } from './types';

const endpoint = '/Trades';

export const getTrades = ({ seller, ...payload }: GetTradesRequestPayload) =>
  Api.get(`${endpoint}${seller ? '/' + seller : ''}`, {
    params: payload,
  });

export const useTrades = ({ page = 1, pageSize = 10, ...props }: UseFetchTradesProps) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradesCount, setTradesCount] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchingError, setFetchingError] = useState<ResponseError | undefined>();

  const fetch = useCallback((payload: GetTradesRequestPayload) => {
    setIsFetching(true);
    getTrades(payload)
      .then((response) => {
        if (response.status === 200) {
          setTrades(response.data.items);
          setTradesCount(response.data.itemsCount);
          setIsFetching(false);
        }
      })
      .catch((err: AxiosError) => {
        setFetchingError({
          status: err.response?.status,
          message: err.message,
        });
      });
  }, []);

  useEffect(() => {
    fetch({ ...props, page, pageSize });
  }, []);

  return {
    trades,
    tradesCount,
    isFetching,
    fetchingError,
    fetchMore: fetch,
  };
};
