import { SubmittableExtrinsic } from '@polkadot/api/types';

export type TTransaction = SubmittableExtrinsic<'promise'>;

export type TransactionOptions = {
  // this function will be called after transaction is created and awaited before proceeding
  sign: (tx: TTransaction) => Promise<TTransaction>;
  // if not provided, signed.send() will be called instead
  send?: (signedTx: TTransaction) => Promise<any | void>;
};

export enum StageStatus {
  default = 'Default',
  inProgress = 'InProgress',
  awaitingSign = 'Awaiting for transaction sign',
  success = 'Success',
  error = 'Error',
}

export type Signer = {
  status: 'init' | 'awaiting' | 'done' | 'error';
  tx: TTransaction;
  onSign: (signedTx: TTransaction) => void;
  onError: (error: Error) => void;
};
export type Stage = {
  title: string;
  description?: string;
  status: StageStatus;
  signer?: Signer;
  error?: Error;
};
export type useStagesReturn<T> = {
  stages: Stage[];
  initiate: (params: T) => Promise<void>;
  status: StageStatus; // status for all stages combined, not for current stage
  error: Error | undefined | null;
};
export type TInternalStageActionParams<T, P = Record<string, never>> = {
  txParams: T;
  options: TransactionOptions;
} & P;
export type TInternalStageAction<T, P = Record<string, never>> = (
  params: TInternalStageActionParams<T, P>,
) => Promise<TTransaction | void> | undefined;

export interface InternalStage<T, P = Record<string, never>> extends Stage {
  // if transaction is returned we will initiate sign procedure, otherwise continue with next stage
  action: TInternalStageAction<T, P>;
}

export type ActionFunction<T, P = Record<string, never>> = (
  action: TInternalStageAction<T, P>,
  txParams: T,
  options: TransactionOptions,
) => Promise<TTransaction | void>;
export type SignFunction = (tx: TTransaction) => Promise<TTransaction>;
