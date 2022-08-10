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
// export type ArtificialFieldRuleType = 'optional' | 'required';

export type TokenField = {
  id: number;
  type: 'select' | 'text';
  name: string;
  multi: boolean;
  items?: string[];
  required: boolean;
};

export type TokenAttributes = {
  [key: string]: string | string[];
};

export type AttributeItemType = {
  id: number;
  fieldType: FieldType;
  name: string;
  rule: FieldRuleType;
  values: string[];
};

export type ArtificialAttributeItemType = {
  id: string;
  optional?: boolean;
  type?: string;
  isArray?: boolean;
  enumValues?: Record<string, unknown>[];
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
  name: string | undefined;
  description: string | undefined;
  tokenPrefix: string | undefined;
  coverImgAddress: string | undefined;
};
