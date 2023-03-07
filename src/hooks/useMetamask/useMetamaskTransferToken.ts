import { useCallback, useState } from 'react';
import { UniqueNFTFactory } from '@unique-nft/solidity-interfaces';
import { ethers } from 'ethers';
import { BN } from 'bn.js';
import { Address } from '@unique-nft/utils';
import { UseMutateAsyncFunction } from 'react-query';
import { ExtrinsicResultResponse } from '@unique-nft/sdk';
import keyring from '@polkadot/ui-keyring';

import { TransferTokenBody, TransferTokenParsed } from '@app/types/Api';

import { useMetamaskFee } from './useMetamaskFee';

const provider =
  (window as any).ethereum && new ethers.providers.Web3Provider((window as any).ethereum);

const getCrossStruct2 = (address: string | undefined) => {
  if (!address) {
    throw new Error('Cant get crossStruct from invalid string');
  }
  const isEth = Address.is.ethereumAddress(address);
  let eth = '';
  let sub = '' as any;
  if (isEth) {
    eth = address;
    sub = '0';
  } else {
    sub = keyring.decodeAddress(address);
    eth = '0x0000000000000000000000000000000000000000';
  }
  return { eth, sub }; // CrossAddressStruct$2
};

export function useMetamaskTransferToken() {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);

  const getEstimateGas = useCallback(async ({ from, to, collectionId, tokenId }) => {
    if (!to) {
      return Promise.resolve(new BN(0));
    }

    const nftFactory = await UniqueNFTFactory(collectionId, provider?.getSigner());

    const estimateGas = await nftFactory.estimateGas.transferFromCross(
      getCrossStruct2(from),
      getCrossStruct2(to),
      tokenId,
    );
    return new BN(estimateGas.toString());
  }, []);

  const { gas, gasPrice, ...feeResult } =
    useMetamaskFee<TransferTokenBody>(getEstimateGas);

  const submitWaitResult: UseMutateAsyncFunction<
    ExtrinsicResultResponse<TransferTokenParsed> | undefined,
    | Error
    | {
        extrinsicError: ExtrinsicResultResponse<any>;
      },
    { payload: TransferTokenBody; senderAddress?: string | undefined }
  > = async ({
    payload,
  }: {
    payload: TransferTokenBody;
    senderAddress?: string | undefined;
  }) => {
    setIsLoadingSubmitResult(true);
    try {
      const nftFactory = await UniqueNFTFactory(
        payload.collectionId,
        provider.getSigner(),
      );

      const tx = await nftFactory.transferFromCross(
        getCrossStruct2(payload.from),
        getCrossStruct2(payload.to),
        payload.tokenId,
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
