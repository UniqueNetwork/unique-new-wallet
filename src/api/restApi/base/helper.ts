import { QueryParams } from '@app/types';

export const serializeToQuery = (value: QueryParams) => {
  const serializedQueryParams: string[] = Object.keys(value).reduce<string[]>(
    (acc, key) => {
      if (value[key] === undefined) {
        return acc;
      }

      if (Array.isArray(value[key])) {
        acc.push(...(value[key] as (number | string)[]).map((item) => `${key}=${item}`));
      } else {
        acc.push(`${key}=${value[key]}`);
      }
      return acc;
    },
    [],
  );
  return `${serializedQueryParams.join('&')}`;
};
