import { useCallback, useState } from 'react';
import { UniqueNFTFactory } from '@unique-nft/solidity-interfaces';
import { ethers } from 'ethers';
import { BN } from 'bn.js';
import { UseMutateAsyncFunction } from 'react-query';
import { ExtrinsicResultResponse } from '@unique-nft/sdk';
import { Address } from '@unique-nft/utils';

import { UnnestTokenBody, TokenId } from '@app/types/Api';

import { useMetamaskFee } from './useMetamaskFee';
import { getCrossStruct2 } from './utils';

const provider =
  (window as any).ethereum && new ethers.providers.Web3Provider((window as any).ethereum);

export function useMetamaskUnnestToken() {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);

  const getEstimateGas = useCallback(async ({ address, parent, nested }) => {
    const { collectionId, tokenId } = nested;
    const from = Address.nesting.idsToAddress(parent.collectionId, parent.tokenId);
    const nftFactory = await UniqueNFTFactory(collectionId, provider?.getSigner());

    const estimateGas = await nftFactory.estimateGas.transferFromCross(
      getCrossStruct2(from),
      getCrossStruct2(address),
      tokenId,
    );
    return new BN(estimateGas.toString());
  }, []);

  const { gas, gasPrice, ...feeResult } = useMetamaskFee<UnnestTokenBody>(getEstimateGas);

  const submitWaitResult: UseMutateAsyncFunction<
    ExtrinsicResultResponse<TokenId> | undefined,
    | Error
    | {
        extrinsicError: ExtrinsicResultResponse<any>;
      },
    { payload: UnnestTokenBody; senderAddress?: string | undefined }
  > = async ({
    payload,
  }: {
    payload: UnnestTokenBody;
    senderAddress?: string | undefined;
  }) => {
    setIsLoadingSubmitResult(true);
    try {
      const { collectionId, tokenId } = payload.nested;
      const nftFactory = await UniqueNFTFactory(collectionId, provider.getSigner());

      const from = Address.nesting.idsToAddress(
        payload.parent.collectionId,
        payload.parent.tokenId,
      );

      const tx = await nftFactory.transferFromCross(
        getCrossStruct2(from),
        getCrossStruct2(payload.address),
        tokenId,
        {
          gasLimit: gas?.toString(),
          gasPrice: gasPrice?.toString(),
        },
      );

      await tx.wait();
    } catch (error: any) {
      setSubmitWaitResultError(error.message);
      throw error;
    } finally {
      setIsLoadingSubmitResult(false);
    }
    return undefined;
  };

  return {
    submitWaitResult,
    isLoadingSubmitResult,
    submitWaitResultError,
    ...feeResult,
  };
}
