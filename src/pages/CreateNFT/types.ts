import { IpfsUploadResponse } from '@unique-nft/sdk';

export interface Option {
  id: number;
  title: string;
  description: string | undefined;
  img: string | undefined;
  tokensLimit?: number;
  tokensCount: number;
}

export type Attribute =
  | string
  | AttributeOption
  | AttributeOption[]
  | undefined
  | { hasDifferentValues: boolean };
export type AttributeType = 'text' | 'select' | 'multiselect';
export type AttributeOption = {
  id: number;
  title: string;
};
export type AttributeView = {
  group?: string;
  values?: Array<string>;
};

export type TokenForm = {
  address?: string;
  owner?: string;
  imageIpfsCid?: string;
  collectionId?: number | null;
  attributes?: Array<Attribute>;
};

export type FilledTokenForm = Required<{
  [P in keyof TokenForm]: NonNullable<TokenForm[P]>;
}>;

export type NewToken = {
  id: number;
  tokenId: number;
  image: {
    file: Blob;
    url: string;
  };
  attributes: Attribute[];
  isReady: boolean;
  isSelected: boolean;
  ipfsCid?: IpfsUploadResponse;
};

export enum CreateTokenDialog {
  editAttributes = 'editAttributes',
  removeToken = 'removeToken',
  changeCollection = 'changeCollection',
}
