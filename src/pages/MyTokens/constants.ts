import { OptionChips } from '@app/types';
import { StatusFilterNft, TypeFilterNft } from '@app/api/graphQL/tokens';

export const defaultStatusFilter: OptionChips<StatusFilterNft>[] = [
  { value: 'allStatus', label: 'All' },
  { value: 'createdByMe', label: 'Created by me' },
  { value: 'purchased', label: 'Purchased' },
];

export const defaultTypeFilter: OptionChips<TypeFilterNft>[] = [
  { value: 'allType', label: 'All' },
  { value: 'NFT', label: 'NFT' },
  { value: 'NESTED', label: 'Bundle' },
];

export const defaultPage = 0;
