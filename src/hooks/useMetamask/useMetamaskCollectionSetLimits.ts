import { useCallback, useState } from 'react';
import { UniqueNFTFactory } from '@unique-nft/solidity-interfaces';
import { ethers } from 'ethers';
import { BN } from 'bn.js';
import { UseMutateAsyncFunction } from 'react-query';
import { ExtrinsicResultResponse, SetCollectionLimitsBody } from '@unique-nft/sdk';

import { useMetamaskFee } from './useMetamaskFee';

const provider =
  (window as any).ethereum && new ethers.providers.Web3Provider((window as any).ethereum);

export function useMetamaskCollectionSetLimits() {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);

  const getEstimateGas = useCallback(
    async ({ address, collectionId, limits }: SetCollectionLimitsBody) => {
      const nftFactory = await UniqueNFTFactory(collectionId, provider?.getSigner());

      const estimateGas = await nftFactory.estimateGas.setCollectionLimit(
        limits.tokenLimit
          ? {
              field: 3, // tokenLimit
              value: {
                status: true,
                value: ethers.BigNumber.from(limits.tokenLimit?.toString()),
              },
            }
          : {
              field: 7, // ownerCanDestroy
              value: {
                status: true,
                value: ethers.BigNumber.from(limits.ownerCanDestroy ? 1 : 0),
              },
            },
        {
          from: address,
        },
      );
      return new BN(estimateGas.toString());
    },
    [],
  );

  const { gas, gasPrice, ...feeResult } =
    useMetamaskFee<SetCollectionLimitsBody>(getEstimateGas);

  const submitWaitResult: UseMutateAsyncFunction<
    ExtrinsicResultResponse<any> | undefined,
    | Error
    | {
        extrinsicError: ExtrinsicResultResponse<any>;
      },
    { payload: SetCollectionLimitsBody; senderAddress?: string | undefined }
  > = async ({
    payload,
  }: {
    payload: SetCollectionLimitsBody;
    senderAddress?: string | undefined;
  }) => {
    setIsLoadingSubmitResult(true);
    try {
      const { collectionId, address, limits } = payload;

      const nftFactory = await UniqueNFTFactory(collectionId, provider?.getSigner());

      const tx = await nftFactory.setCollectionLimit(
        limits.tokenLimit
          ? {
              field: 3, // tokenLimit
              value: {
                status: true,
                value: ethers.BigNumber.from(limits.tokenLimit?.toString()),
              },
            }
          : {
              field: 7, // ownerCanDestroy
              value: {
                status: true,
                value: ethers.BigNumber.from(limits.ownerCanDestroy ? 1 : 0),
              },
            },
        {
          gasLimit: gas?.toString(),
          gasPrice: gasPrice?.toString(),
          from: address,
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
