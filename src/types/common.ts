export type Nullable<T> = T | null;

export type QueryParams = Record<string, string | number | (string | number)[]>;

export type Pagination = {
  page: number;
  pageSize: number;
};

export type Sortable = {
  sort?: string[];
};

export type PaginatedResponse<T> = {
  page: number;
  pageSize: number;
  itemsCount: number;
  items: T[];
};

export type ResponseError = {
  status?: number;
  message: string;
  prettifiedMessage?: string;
};
