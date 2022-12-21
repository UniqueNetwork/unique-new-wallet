import { useCallback, useState } from 'react';
import { UniqueNFTFactory } from '@unique-nft/solidity-interfaces';
import { ethers } from 'ethers';
import { BN } from 'bn.js';
import { Address } from '@unique-nft/utils';

import { TransferFormDataType } from '@app/pages/NFTDetails/Modals/Transfer/type';
import { TransferTokenBody } from '@app/types/Api';

import { useMetamaskFee } from './useMetamaskFee';

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

export function useMetamaskTransferToken() {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);

  const getEstimateGas = useCallback(async ({ to, collectionId, tokenId }) => {
    if (!to) {
      return Promise.resolve(new BN(0));
    }

    const nftFactory = await UniqueNFTFactory(collectionId, provider.getSigner());
    const destinationAddress = Address.is.ethereumAddress(to)
      ? to
      : Address.mirror.substrateToEthereum(to);

    const estimateGas = await nftFactory.estimateGas.transfer(
      destinationAddress,
      tokenId,
    );

    return new BN(estimateGas.toString());
  }, []);

  const { gas, gasPrice, ...feeResult } =
    useMetamaskFee<TransferTokenBody>(getEstimateGas);

  const submitWaitResult = async ({ payload }: { payload: TransferFormDataType }) => {
    setIsLoadingSubmitResult(true);
    try {
      const nftFactory = await UniqueNFTFactory(
        payload.collectionId,
        provider.getSigner(),
      );

      const destinationAddress = Address.is.ethereumAddress(payload.to)
        ? payload.to
        : Address.mirror.substrateToEthereum(payload.to);

      const tx = await nftFactory.transfer(destinationAddress, payload.tokenId, {
        gasLimit: gas?.toString(),
        gasPrice: gasPrice?.toString(),
      });

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
