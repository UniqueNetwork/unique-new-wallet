import { useMemo } from 'react';
import { Address } from '@unique-nft/utils/address';
import { TokenByIdResponse } from '@unique-nft/sdk';

import { useAccounts } from '@app/hooks';
import { useTokenGetBalance } from '@app/api/restApi/token/useTokenGetBalance';

export const useIsOwner = (token: TokenByIdResponse | undefined) => {
  const { selectedAccount } = useAccounts();

  const { data: fractionsBalance } = useTokenGetBalance({
    tokenId: token?.tokenId,
    collectionId: token?.collectionId,
    address: selectedAccount?.address,
    isFractional: token?.collection.mode === 'ReFungible',
  });

  return useMemo(() => {
    if (fractionsBalance?.amount) {
      return true;
    }

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
  }, [selectedAccount?.address, token?.owner, fractionsBalance]);
};
