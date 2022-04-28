import { ApiPromise } from '@polkadot/api';

import { getTokenImage } from '@app/api';

import '@unique-nft/types/augment-api-rpc';

import { INFTController } from '../types';
import { NFTCollection, NFTToken } from './types';
import {
  collectionName16Decoder,
  decodeStruct,
  getOnChainSchema,
  hex2a,
} from '../utils/decoder';
import { getEthAccount, normalizeAccountId } from '../utils/addressUtils';

export type NFTControllerConfig = {
  collectionsIds: number[];
};

class UniqueNFTController implements INFTController<NFTCollection, NFTToken> {
  private api: ApiPromise;
  private collectionsIds: number[];

  constructor(api: ApiPromise, config?: NFTControllerConfig) {
    this.api = api;
    this.collectionsIds = config?.collectionsIds || [];
  }

  public async getToken(collectionId: number, tokenId: number): Promise<NFTToken | null> {
    if (!this.api || !collectionId) {
      return null;
    }

    try {
      const collection = await this.api.rpc.unique.collectionById(
        collectionId.toString(),
      );

      if (!collection) {
        return null;
      }

      const collectionInfo = collection.toJSON() as unknown as NFTCollection;

      const variableData = (
        await this.api.rpc.unique.variableMetadata(collectionId, tokenId)
      ).toJSON();
      const constData: string = (
        await this.api.rpc.unique.constMetadata(collectionId, tokenId)
      ).toJSON();
      const crossAccount = normalizeAccountId(
        (await this.api.rpc.unique.tokenOwner(collectionId, tokenId)).toJSON() as string,
      ) as { Substrate: string };

      let imageUrl = '';

      if (collectionInfo.offchainSchema) {
        imageUrl = await getTokenImage(collectionInfo, tokenId);
      }

      const onChainSchema = getOnChainSchema(collectionInfo);

      return {
        attributes: {
          ...decodeStruct({ attr: onChainSchema.attributesConst, data: constData }),
          ...decodeStruct({ attr: onChainSchema.attributesVar, data: variableData }),
        },
        constData,
        id: tokenId,
        collectionId,
        imageUrl,
        owner: crossAccount,
        variableData,
        collectionName: collectionName16Decoder(collectionInfo.name),
        prefix: hex2a(collectionInfo.tokenPrefix),
        description: collectionName16Decoder(collectionInfo.description),
        collectionCover: collectionInfo.coverImageUrl,
      };
    } catch (e) {
      console.log('getDetailedTokenInfo error', e);

      return null;
    }
  }

  public async getAccountTokens(account: string): Promise<NFTToken[]> {
    if (!this.api || !account) {
      return [];
    }
    const tokens: NFTToken[] = [];

    for (const collectionId of this.collectionsIds) {
      const tokensIds = (await this.api.rpc.unique.accountTokens(
        collectionId,
        normalizeAccountId(account),
      )) as TokenId[];
      const tokensIdsOnEth = (await this.api.rpc.unique.accountTokens(
        collectionId,
        normalizeAccountId(getEthAccount(account)),
      )) as TokenId[];

      const tokensOfCollection = (await Promise.all(
        [...tokensIds, ...tokensIdsOnEth].map((item) =>
          this.getToken(collectionId, item.toNumber()),
        ),
      )) as NFTToken[];

      tokens.push(...tokensOfCollection);
    }

    return tokens;
  }
}

type TokenId = {
  toNumber(): number;
};

export default UniqueNFTController;
