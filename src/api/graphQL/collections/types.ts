import { Collection, Direction, Pagination } from '../types';

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

export type CollectionNestingOption = Pick<
  Collection,
  'collection_id' | 'name' | 'collection_cover'
>;
