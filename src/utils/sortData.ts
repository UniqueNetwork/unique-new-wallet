import { SortQuery, TableRowProps } from '@app/components/TableBase';

export const sortData = (
  data: TableRowProps[],
  query: SortQuery,
  compareFunc?: (a: any, b: any) => number,
) => {
  const sorted = [...data].sort((a: any, b: any) =>
    compareFunc
      ? compareFunc(a[query.field], b[query.field])
      : (a[query.field] as string)?.localeCompare(b[query.field] as string),
  );
  return query.mode === 0 ? data : query.mode === 1 ? sorted.reverse() : sorted;
};
