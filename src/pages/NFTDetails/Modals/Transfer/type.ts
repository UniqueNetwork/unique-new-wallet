export type TransferFormDataType = {
  to: string;
  from: string;
  address: string;
  tokenId: number;
  collectionId: number;
};

export type TransferRefungibleFormDataType = {
  to: string;
  from: string;
  address: string;
  tokenId: number;
  collectionId: number;
  amount: number;
};
