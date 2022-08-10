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
