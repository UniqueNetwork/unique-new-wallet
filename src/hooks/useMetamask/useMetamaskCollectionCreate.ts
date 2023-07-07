import { useCallback, useState } from 'react';
import {
  CollectionHelpersFactory,
  UniqueNFTFactory,
} from '@unique-nft/solidity-interfaces';
import { ethers } from 'ethers';
import { BN } from 'bn.js';
import { UseMutateAsyncFunction } from 'react-query';
import {
  ExtrinsicResultResponse,
  CreateCollectionBody,
  CreateCollectionParsed,
} from '@unique-nft/sdk';
import { CollectionAttributesSchema, SchemaTools } from '@unique-nft/schemas';
import { Utf16 } from '@unique-nft/utils/string';
import { Address } from '@unique-nft/utils';

import { useMetamaskFee } from './useMetamaskFee';

const provider =
  (window as any).ethereum && new ethers.providers.Web3Provider((window as any).ethereum);

export function useMetamaskCollectionCreate() {
  const [submitWaitResultError, setSubmitWaitResultError] = useState<string>();
  const [isLoadingSubmitResult, setIsLoadingSubmitResult] = useState(false);
  const getEstimateGas = useCallback(
    async ({ address, tokenPrefix, description, name }: CreateCollectionBody) => {
      const collectionHelpers = await CollectionHelpersFactory(provider?.getSigner());

      const fee = await collectionHelpers.collectionCreationFee();
      return new BN(fee.toString());
    },
    [],
  );

  const { gas, gasPrice, ...feeResult } =
    useMetamaskFee<CreateCollectionBody>(getEstimateGas);

  const submitWaitResult: UseMutateAsyncFunction<
    ExtrinsicResultResponse<CreateCollectionParsed> | undefined,
    | Error
    | {
        extrinsicError: ExtrinsicResultResponse<any>;
      },
    { payload: CreateCollectionBody; senderAddress?: string | undefined }
  > = async ({
    payload,
  }: {
    payload: CreateCollectionBody;
    senderAddress?: string | undefined;
  }) => {
    setIsLoadingSubmitResult(true);
    try {
      const { name, description, tokenPrefix, schema, address } = payload;

      if (!schema) {
        throw new Error('Schema is unavailable');
      }

      const { coverPicture, attributesSchema } = schema;
      const encodedSchema = SchemaTools.tools.unique.collection
        // @ts-ignore
        .encodeCollectionSchemaToProperties({
          ...schema,
          coverPicture: { ipfsCid: (coverPicture as { ipfsCid: string })?.ipfsCid || '' },
          attributesSchema: attributesSchema as CollectionAttributesSchema,
        })
        .map(({ key, value }) => ({
          key,
          value: Utf16.stringToNumberArray(value || ''),
        }));

      // const collectionHelpers = await CollectionHelpersFactory(provider?.getSigner());
      // const fee = await collectionHelpers.collectionCreationFee();
      // const createCollectionTx = await collectionHelpers.createNFTCollection(
      //   name,
      //   description,
      //   tokenPrefix,
      //   {
      //     from: address,
      //     value: fee,
      //   },
      // );

      // const createCollectionResult = await createCollectionTx.wait();

      // const collectionAddress = createCollectionResult.events?.[0].args
      //   ?.collectionId as string;

      const nftFactory = await UniqueNFTFactory(1900, provider?.getSigner());

      // const setPropertiesTx = await nftFactory.setCollectionProperties(encodedSchema);
      // await setPropertiesTx.wait();

      //      await (await nftFactory.setCollectionAccess(0)).wait();

      const setMintModeTx = await nftFactory.setCollectionMintMode(true);
      await setMintModeTx.wait();

      return {
        isCompleted: true,
        parsed: 1900, // { collectionId: Address.collection.addressToId(collectionAddress) },
      } as unknown as ExtrinsicResultResponse<CreateCollectionParsed>;
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
