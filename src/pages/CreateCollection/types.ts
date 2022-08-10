export type Warning = {
  title: string;
  description: string;
};

export type AttributeFieldType = {
  id: 'string' | 'enum' | 'repeated';
  title: 'Text' | 'Select' | 'Multiselect';
};

export type AttributeFieldOptional = {
  id: 'optional' | 'required';
  title: 'Optional' | 'Required';
};

export type AttributeField = {
  name?: string;
  type: AttributeFieldType;
  optional: AttributeFieldOptional;
  values?: string[];
};

export type CollectionForm = {
  address: string;
  name: string;
  description: string;
  symbol: string;
  coverPictureIpfsCid?: string;
  sponsorAddress: string;
  tokenLimit?: number;
  ownerCanDestroy?: boolean;
  attributes?: AttributeField[];
};
