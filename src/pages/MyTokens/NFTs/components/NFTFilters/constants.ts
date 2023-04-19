import { iconDown, iconUp } from '@app/utils';

import { SortOption } from './types';

export const sortOptions: SortOption[] = [
  {
    title: 'Token ID',
    id: 'token_id_asc',
    iconRight: iconUp,
    sortParam: { token_id: 'asc' },
  },
  {
    title: 'Token ID',
    id: 'token_id_desc',
    iconRight: iconDown,
    sortParam: { token_id: 'desc' },
  },
  {
    title: 'Creation date',
    id: 'date_of_creation_asc',
    iconRight: iconUp,
    sortParam: { date_of_creation: 'asc' },
  },
  {
    title: 'Creation date',
    id: 'date_of_creation_desc',
    iconRight: iconDown,
    sortParam: { date_of_creation: 'desc' },
  },
  {
    title: 'Collection ID',
    id: 'collection_id_asc',
    iconRight: iconUp,
    sortParam: { collection_id: 'asc' },
  },
  {
    title: 'Collection ID',
    id: 'collection_id_desc',
    iconRight: iconDown,
    sortParam: { collection_id: 'desc' },
  },
];
