import { useMemo } from 'react';
import { Address } from '@unique-nft/utils/address';
import { GetBundleResponse, TokenByIdResponse } from '@unique-nft/sdk';

import { useAccounts } from '@app/hooks';

export const useIsOwner = (token: TokenByIdResponse | GetBundleResponse | undefined) => {
  const { selectedAccount } = useAccounts();

  return useMemo(() => {
    if (!token?.owner || !selectedAccount?.address) {
      return false;
    }
    let address = token.owner;

    if (Address.is.ethereumAddress(token.owner)) {
      address = Address.extract.substrateOrMirrorIfEthereum(token.owner);
    }
    return (
      Address.extract.addressNormalized(address) ===
      Address.extract.addressNormalized(selectedAccount.address)
    );
  }, [selectedAccount?.address, token?.owner]);
};
