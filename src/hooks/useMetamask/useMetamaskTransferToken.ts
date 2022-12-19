import { useState } from 'react';
import { UniqueNFTFactory } from '@unique-nft/solidity-interfaces';
import { ethers } from 'ethers';

import { TransferFormDataType } from '@app/pages/NFTDetails/Modals/Transfer/type';

import { useMetamaskFee } from './useMetamaskFee';

export function useMetamaskTransferToken() {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);

  const feeResult = useMetamaskFee();

  const submitWaitResult = async ({ payload }: { payload: TransferFormDataType }) => {
    setIsLoadingSubmitResult(true);
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const nftFactory = await UniqueNFTFactory(
        payload.collectionId,
        provider.getSigner(),
      );

      const tx = await nftFactory.transfer(payload.to, payload.tokenId);

      await tx.wait();
    } catch (error: any) {
      setSubmitWaitResultError(error.message);
      throw error;
    } finally {
      setIsLoadingSubmitResult(false);
    }
  };

  return {
    submitWaitResult,
    isLoadingSubmitResult,
    submitWaitResultError,
    ...feeResult,
  };
}
