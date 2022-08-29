import { Option } from '@app/types';
import { TypeFilter } from '@app/api/graphQL/tokens';

export const defaultTypesFilters: Option<TypeFilter>[] = [
  { id: 'purchased', label: 'Purchased' },
  { id: 'createdByMe', label: 'Created by me' },
];

export const defaultPage = 0;
export const defaultLimit = 10;
