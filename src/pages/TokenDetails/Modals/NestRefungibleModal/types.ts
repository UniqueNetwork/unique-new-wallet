import { CollectionNestingOption } from '@app/api';
import { Token } from '@app/api/graphQL/types';

export type NestRefungibleFormDataType = {
  amount: number;
  collection: CollectionNestingOption | null;
  token: Token | null;
};
