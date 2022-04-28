import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { get } from '../base';
import { Offer } from './types';
import { defaultParams } from '../base/axios';
import { ResponseError } from '../base/types';

const endpoint = '/offer';

export const getOffer = (collectionId: number, tokenId: number) =>
  get<Offer>(`${endpoint}/${collectionId}/${tokenId}`, { ...defaultParams });

export const useOffer = (collectionId: number, tokenId: number) => {
  const [offer, setOffer] = useState<Offer>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchingError, setFetchingError] = useState<ResponseError | undefined>();

  const fetch = useCallback((collectionId: number, tokenId: number) => {
    setIsFetching(true);
    getOffer(collectionId, tokenId)
      .then((response) => {
        if (response.status === 200) {
          setOffer(response.data);
          setIsFetching(false);
        }
      })
      .catch((err: AxiosError) => {
        setOffer(undefined);
        setFetchingError({
          status: err.response?.status,
          message: err.message,
        });
      });
  }, []);

  useEffect(() => {
    fetch(collectionId, tokenId);
  }, [collectionId, tokenId, fetch]);

  return {
    offer,
    isFetching,
    fetchingError,
    fetch,
  };
};
