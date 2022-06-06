import { UseQueryResult } from 'react-query';

import { ChainPropertiesResponse } from '@app/types/Api';

import { useApiQuery } from '../../hooks';
import { PropertiesApiService } from '../PropertiesApiService';

export const usePropertiesService = (): UseQueryResult<ChainPropertiesResponse> =>
  useApiQuery({
    endpoint: PropertiesApiService.propertiesQuery,
    payload: undefined,
  });
