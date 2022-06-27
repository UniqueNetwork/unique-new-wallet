import { useContext, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { NftTokenDTO } from '@app/types';
import { useAccounts } from '@app/hooks/useAccounts';
import { useExtrinsicSubmit, useTokenCreate } from '@app/api';
import { TokenFormContext } from '@app/context';

export const useTokenMutation = (collectionId: number) => {
  const { attributes } = useContext(TokenFormContext);
  const [isCreatingNFT, setIsCreatingNFT] = useState<boolean>(false);
  const { selectedAccount, signMessage } = useAccounts();
  const { createToken } = useTokenCreate();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { error, info } = useNotifications();

  // TODO - add error handler for low balance - Error. Balance too low
  const onCreateNFT = async () => {
    const tokenFull: NftTokenDTO = {
      address: selectedAccount?.address ?? '',
      collectionId,
      owner: selectedAccount?.address ?? '',
      constData: attributes,
    };

    setIsCreatingNFT(true);

    const createResp = await createToken(tokenFull);

    if (!createResp?.signerPayloadJSON) {
      error('Create NFT error', {
        name: 'Create NFT',
        size: 32,
        color: 'white',
      });

      setIsCreatingNFT(false);

      return;
    }

    const signature = await signMessage(createResp.signerPayloadJSON, selectedAccount);

    await submitExtrinsic({
      signerPayloadJSON: createResp.signerPayloadJSON,
      signature,
    });

    info('NFT successfully created', {
      name: 'Create NFT',
      size: 32,
      color: 'white',
    });

    setIsCreatingNFT(false);
  };

  return {
    isCreatingNFT,
    onCreateNFT,
  };
};
