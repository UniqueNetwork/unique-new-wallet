import { IOption } from '@app/pages/CreateNFT/AttributesRow';
import type { TokenAttributes } from '@app/types';

export const generateTokenFromValues = (values: any) => {
  return Object.keys(values)
    .map((key: string) => ({
      [key]: Array.isArray(values[key])
        ? (values[key].map((item: IOption) => item.title) as string[])
        : (values[key] as string),
    }))
    .reduce((a, v) => ({ ...a, ...v }), {}) as TokenAttributes;
};
