import {
  QueryObserver,
  useQueryClient,
  UseQueryResult,
  QueryObserverOptions,
} from 'react-query';
import { useEffect, useMemo, useState } from 'react';

export const useQueryObserver = <T,>(query: QueryObserverOptions) => {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<UseQueryResult<T> | null>(null);
  const observer = useMemo(
    () => new QueryObserver(queryClient, query),
    [query, queryClient],
  );
  useEffect(() => {
    return observer.subscribe((result) => {
      setResult(result as UseQueryResult<T>);
    });
  });
  return result;
};
