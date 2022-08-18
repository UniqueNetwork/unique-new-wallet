import { Direction, Pagination } from '../types';

export type TOrderBy = {
  collection_id?: Direction;
  tokens_count?: Direction;
};

export type OptionsAccountCollection = {
  skip?: boolean;
  order?: TOrderBy;
  pagination: Pagination;
  search?: string;
};
