import { useContext, useState, useCallback } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { NftTokenDTO } from '@app/types';
import { useAccounts } from '@app/hooks/useAccounts';
import { useExtrinsicSubmit, useTokenCreate } from '@app/api';
import { TokenFormContext } from '@app/context';
import { useTxStatusCheck } from '@app/hooks/useTxStatusCheck';
import { UnsignedTxPayloadResponse } from '@app/types/Api';
import { useFee } from '@app/hooks/useFee';

export const useTokenMutation = (collectionId: number) => {
  const { attributes } = useContext(TokenFormContext);
  const [isCreatingNFT, setIsCreatingNFT] = useState<boolean>(false);
  const { selectedAccount, signMessage } = useAccounts();
  const { createToken } = useTokenCreate();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { error } = useNotifications();
  const { checkTxStatus } = useTxStatusCheck();
  const { fee, getFee } = useFee();

  const generateExtrinsic = useCallback(async () => {
    if (!collectionId || !attributes?.ipfsJson) {
      return;
    }

    const tokenFull: NftTokenDTO = {
      address: selectedAccount?.address ?? '',
      collectionId,
      owner: selectedAccount?.address ?? '',
      constData: attributes,
    };

    const createResp = await createToken(tokenFull);

    if (!createResp?.signerPayloadJSON) {
      error('Create NFT error', {
        name: 'Create NFT',
        size: 32,
        color: 'white',
      });

      return;
    }

    await getFee(createResp);

    return createResp;
  }, [attributes, collectionId, createToken, error, getFee, selectedAccount?.address]);

  // TODO - add error handler for low balance - Error. Balance too low
  const onCreateNFT = async () => {
    setIsCreatingNFT(true);
    const createResp = (await generateExtrinsic()) as UnsignedTxPayloadResponse;

    if (!createResp) {
      setIsCreatingNFT(false);
    }

    const signature = await signMessage(createResp.signerPayloadJSON, selectedAccount);

    if (!signature) {
      error('Sign transaction error', {
        name: 'Create NFT',
        size: 32,
        color: 'white',
      });

      setIsCreatingNFT(false);

      return;
    }

    const submitResult = await submitExtrinsic({
      signerPayloadJSON: createResp.signerPayloadJSON,
      signature,
    });

    if (!submitResult || !submitResult.hash) {
      error('Submit Create NFT transaction error', {
        name: 'Create NFT',
        size: 32,
        color: 'white',
      });

      return;
    }

    checkTxStatus(submitResult.hash);

    setIsCreatingNFT(false);
  };

  return {
    fee,
    generateExtrinsic,
    isCreatingNFT,
    onCreateNFT,
  };
};
