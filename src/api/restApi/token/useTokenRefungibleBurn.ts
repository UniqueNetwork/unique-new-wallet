import { BurnRefungibleBody, BurnRefungibleParsed } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';
import { useExtrinsicMutation } from '@app/api';

export const useTokenRefungibleBurn = () => {
  const { api } = useApi();

  return useExtrinsicMutation<BurnRefungibleBody, BurnRefungibleParsed>(
    // @ts-ignore
    api.refungible.burn,
  );
};
