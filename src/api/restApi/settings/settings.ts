import { useEffect, useState } from 'react';

import { ResponseError } from '@app/types';

import { get } from '../base';
import { defaultParams } from '../base/axios';

const endpoint = '/api/settings';

export type Settings = {
  blockchain: {
    escrowAddress: string;
    unique: {
      wsEndpoint: string;
      collectionIds: number[];
      contractAddress: string;
    };
    kusama: {
      wsEndpoint: string;
      minterCommission: string;
    };
  };
  auction: {
    commission: number;
    address: string;
  };
};

export const getSettings = () => get<Settings>(`${endpoint}`, { ...defaultParams });

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | undefined>();
  const [isFetching, setIsFetching] = useState<boolean | undefined>(false);
  const [fetchingError, setFetchingError] = useState<ResponseError | undefined>();

  useEffect(() => {
    setIsFetching(true);

    getSettings()
      .then((response) => {
        setIsFetching(false);

        if (response.status === 200) {
          setIsFetching(false);
          setSettings(response.data);
        }
      })
      .catch((error) => {
        setFetchingError(error);
      });
  }, []);

  return {
    settings,
    isFetching,
    fetchingError,
  };
};
