import { ApiPromise } from '@polkadot/api';
import { ICollectionController } from '../types';
import { NFTCollection, NFTToken } from './types';
import { collectionName8Decoder, getOnChainSchema, hex2a } from '../utils/decoder';
import { getTokenImage } from '../utils/imageUtils';
import config from '../../../config';

const { IPFSGateway } = config;

class UniqueCollectionController implements ICollectionController<NFTCollection, NFTToken> {
  private api: ApiPromise;
  private featuredCollectionIds: number[];

  constructor(api: ApiPromise, featuredCollectionIds: number[]) {
    this.api = api;
    this.featuredCollectionIds = featuredCollectionIds;
  }

  public async getCollection(collectionId: number): Promise<NFTCollection | null> {
    if (!this.api) {
      return null;
    }

    const collection =
      // @ts-ignore
      await this.api.rpc.unique.collectionById(collectionId.toString());

    const collectionInfo = collection.toJSON() as unknown as NFTCollection;
    let coverImageUrl = '';

    if (collectionInfo?.variableOnChainSchema && hex2a(collectionInfo?.variableOnChainSchema)) {
      const collectionSchema = getOnChainSchema(collectionInfo);
      const image = JSON.parse(collectionSchema?.attributesVar)?.collectionCover as string;

      coverImageUrl = `${IPFSGateway}/${image}`;
    } else {
      if (collectionInfo?.offchainSchema) {
        coverImageUrl = await getTokenImage(collectionInfo, 1);
      }
    }

    return {
      ...collectionInfo,
      collectionName: collectionInfo?.name && collectionName8Decoder(collectionInfo?.name),
      coverImageUrl,
      id: collectionId
    };
  }

  public getCollections(): Promise<NFTCollection[]> {
    throw new Error('There to many collections available, please use featured collections instead');
    // if (!this.api) {
    //   return [];
    // }
    //
    // try {
    //   // @ts-ignore
    //   const fullCount = (await this.api.rpc.unique.collectionStats()) as { created: u32, destroyed: u32 };
    //   const createdCollectionCount = fullCount.created.toNumber();
    //   const destroyedCollectionCount = fullCount.destroyed.toNumber();
    //   const collectionsCount = createdCollectionCount - destroyedCollectionCount;
    //   const collections: Array<NFTCollection> = [];
    //
    //   for (let i = 1; i <= collectionsCount; i++) {
    //     const collectionInf = await this.getCollection(i) as unknown as NFTCollection;
    //
    //     if (collectionInf && collectionInf.owner && collectionInf.owner.toString() !== '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM') {
    //       collections.push({ ...collectionInf, id: i });
    //     }
    //   }
    //
    //   return collections;
    // } catch (e) {
    //   throw e;
    // }
  }

  public async getFeaturedCollections(): Promise<NFTCollection[]> {
    if (!this.api || !this.featuredCollectionIds.length) {
      return [];
    }

    const collections: Array<NFTCollection> = [];
    for (let i = 0; i < this.featuredCollectionIds.length; i++) {
      const collectionInf = await this.getCollection(this.featuredCollectionIds[i]) as unknown as NFTCollection;

      if (collectionInf && collectionInf.owner && collectionInf.owner.toString() !== '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM' && !collections.find((collection) => collection.id === this.featuredCollectionIds[i])) {
        collections.push({ ...collectionInf, id: this.featuredCollectionIds[i] });
      }
    }

    return collections;
  }

  public async getTokensOfCollection(collectionId: number, ownerId: string): Promise<NFTToken[]> {
    if (!this.api || !collectionId || !ownerId) {
      return [];
    }

    // @ts-ignore
    return await this.api.query.unique.accountTokens(collectionId, { Substrate: ownerId });
  }
}

export default UniqueCollectionController;
