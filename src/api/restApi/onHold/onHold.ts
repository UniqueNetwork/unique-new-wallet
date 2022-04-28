import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { get } from '../base';
import { serializeToQuery } from '../base/helper';
import {
  GetOnHoldRequestPayload,
  OnHold,
  OnHoldResponse,
  UseFetchOnHoldProps,
} from './types';
import { QueryParams, ResponseError } from '../base/types';

const endpoint = '/OnHold';

export const getOnHold = ({ owner, ...payload }: GetOnHoldRequestPayload) =>
  get<OnHoldResponse>(
    `${endpoint}${owner ? '/' + owner : ''}` +
      serializeToQuery(payload as unknown as QueryParams),
  );

export const useOnHold = ({ page = 1, pageSize = 10, ...props }: UseFetchOnHoldProps) => {
  const [onHoldItems, setOnHoldItems] = useState<OnHold[]>([]);
  const [onHoldCount, setOnHoldCount] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchingError, setFetchingError] = useState<ResponseError | undefined>();

  const fetch = useCallback((payload: GetOnHoldRequestPayload) => {
    setIsFetching(true);
    getOnHold(payload)
      .then((response) => {
        if (response.status === 200) {
          setOnHoldItems(response.data.items);
          setOnHoldCount(response.data.itemsCount);
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
    onHoldItems,
    onHoldCount,
    isFetching,
    fetchingError,
    fetchMore: fetch,
  };
};
