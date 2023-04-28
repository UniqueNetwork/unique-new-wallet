import { Option } from '@app/utils';
import { Direction } from '@app/api/graphQL/types';
export type SortOption = Option & { sortParam: { [field: string]: Direction } };
