import { useMemo } from 'react';
import { Address } from '@unique-nft/utils/address';
import { TokenByIdResponse } from '@unique-nft/sdk';

import { useAccounts } from '@app/hooks';
import { useTokenGetBalance } from '@app/api/restApi/token/useTokenGetBalance';
import { useTokenTopmostOwner } from '@app/api/restApi/token/useTokenTopmostOwner';

export const useIsOwner = (
  token: TokenByIdResponse | undefined,
  parentAddress?: string,
) => {
  const { selectedAccount } = useAccounts();

  const parent = Address.is.nestingAddress(parentAddress || '')
    ? Address.nesting.addressToIds(parentAddress || '')
    : undefined;

  const { data: topmostAccount } = useTokenTopmostOwner({
    collectionId: parent?.collectionId,
    tokenId: parent?.tokenId,
  });

  const { data: fractionsBalance } = useTokenGetBalance({
    tokenId: token?.tokenId,
    collectionId: token?.collectionId,
    address: selectedAccount?.address,
    isFractional: token?.collection.mode === 'ReFungible',
  });

  return useMemo(() => {
    if (topmostAccount?.topmostOwner) {
      return topmostAccount.topmostOwner === selectedAccount?.address;
    }

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
  }, [selectedAccount?.address, token?.owner, fractionsBalance, topmostAccount]);
};
