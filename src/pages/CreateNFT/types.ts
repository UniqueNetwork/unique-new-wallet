export interface Option {
  id: number;
  title: string;
  description: string | undefined;
  img: string | undefined;
}

export type Attribute = string | AttributeOption | AttributeOption[];
export type AttributeType = 'text' | 'select' | 'multiselect';
export type AttributeOption = {
  id: number;
  title: number | number[];
};

export type TokenForm = {
  address: string;
  owner: string;
  collectionId?: number;
  imageIpfsCid: string;
  attributes?: Array<Attribute>;
};
