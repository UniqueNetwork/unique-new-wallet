export type FieldType = 'string' | 'enum';

export type FieldRuleType = 'optional' | 'required' | 'repeated';

export enum MinterType {
  default = 'Not started', // initial state
  purchase = 'Purchase', // fix price
  bid = 'Bid',
  withdrawBid = 'Withdraw bid',
  sellFix = 'Sell for fixed price',
  sellAuction = 'Auction',
  transfer = 'Transfer',
  delist = 'Cancel sell',
  delistAuction = 'Cancel auction',
}

export type ArtificialFieldType = 'string' | 'enum' | 'repeated';
export type ArtificialFieldRuleType = 'optional' | 'required';

export type AttributeItemType = {
  id: number;
  fieldType: FieldType;
  name: string;
  rule: FieldRuleType;
  values: string[];
};

export type ArtificialAttributeItemType = {
  id: number;
  fieldType: ArtificialFieldType;
  name: string;
  rule: ArtificialFieldRuleType;
  values: string[];
};

export type EnumElemType = {
  options: { [key: string]: string };
  values: { [key: string]: number };
};
export type NFTMetaType = {
  fields: {
    [key: string]: {
      id: number;
      rule: FieldRuleType;
      type: string;
    };
  };
};

export type ProtobufAttributeType = {
  nested: {
    onChainMetaData: {
      nested: {
        [key: string]: {
          fields?: {
            [key: string]: {
              id: number;
              rule: FieldRuleType;
              type: string;
            };
          };
          options?: { [key: string]: string };
          values?: { [key: string]: number };
        };
      };
    };
  };
};

export type MainInformationInitialValues = {
  name: string;
  description?: string;
  tokenPrefix: string;
  coverImgAddress?: string;
  file?: { url: string; file: Blob } | null;
};
