import { OptionChips } from '@app/types';
import { StatusFilterNft, TypeFilterNft } from '@app/api/graphQL/tokens';
import { Direction } from '@app/api/graphQL/types';

export const defaultStatusFilter: OptionChips<StatusFilterNft>[] = [
  { value: 'allStatus', label: 'All' },
  { value: 'createdByMe', label: 'Created by me' },
  { value: 'purchased', label: 'Purchased' },
];

export const defaultTypeFilter: OptionChips<TypeFilterNft>[] = [
  { value: 'allType', label: 'All' },
  { value: 'NFT', label: 'NFT' },
  { value: 'RFT', label: 'Fractional' },
  { value: 'NESTED', label: 'Bundle' },
];

export const defaultSort: Record<string, Direction> = { token_id: 'asc' };

export const defaultPage = 0;

export const AngelHackBaseCollectionId: Record<string, number> = {
  OPAL: 2048,
  UNIQUE: 304,
};

export const AngelHackWearablesCollectionId: Record<string, number> = {
  OPAL: 2049,
  UNIQUE: 305,
};
