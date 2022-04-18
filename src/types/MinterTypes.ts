export enum MinterType {
  default = 'Not started', // initial state
  purchase = 'Purchase', // fix price
  bid = 'Bid',
  withdrawBid = 'Withdraw bid',
  sellFix = 'Sell for fixed price',
  sellAuction = 'Auction',
  transfer = 'Transfer',
  delist = 'Cancel sell',
  delistAuction = 'Cancel auction'
}

export type ArtificialFieldType = 'string' | 'enum' | 'repeated';
export type ArtificialFieldRuleType = 'optional' | 'required';

export type ArtificialAttributeItemType = {
  id: number,
  fieldType: ArtificialFieldType;
  name: string;
  rule: ArtificialFieldRuleType;
  values: string[];
}