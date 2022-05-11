import { useApi } from '@app/hooks/useApi';

export const useChainFormattedOwner = (owner: string): string | undefined => {
  const { chainAddressFormat } = useApi();

  return chainAddressFormat(owner);
};
