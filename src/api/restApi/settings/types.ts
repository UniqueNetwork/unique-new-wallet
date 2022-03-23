export type Settings = {
  blockchain: {
    escrowAddress: string;
    unique: {
      wsEndpoint: string;
      collectionIds: number[];
      contractAddress: string;
    };
    kusama: {
      wsEndpoint: string;
      minterCommission: string;
    };
  };
  auction: {
    commission: number;
    address: string;
  };
};
