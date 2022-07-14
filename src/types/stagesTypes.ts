export type SignFunction<TX, Signature = string> = (tx: TX) => Promise<Signature>;

export type TransactionOptions<TX, Signature = string> = {
  // this function will be called after transaction is created and awaited before proceeding
  sign: SignFunction<TX>;
  // if not provided, signed.send() will be called instead
  send?: (signature: Signature) => Promise<any | void>;
};

export enum StageStatus {
  default = 'Default',
  inProgress = 'InProgress',
  awaitingSign = 'Awaiting for transaction sign',
  success = 'Success',
  error = 'Error',
}

export type Stage = {
  title: string;
  status: StageStatus;
  error?: Error;
};
