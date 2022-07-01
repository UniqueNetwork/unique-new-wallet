import { Stage, StageStatus } from '@app/types';

type StageObjectType =
  | 'Default'
  | 'InProgress'
  | 'Success'
  | 'ApiError'
  | 'TransferingError'
  | 'SigningError'
  | 'SumbittingError'
  | 'CalculatingFeeError'
  | 'UnexpectedError';

const unexpectedError = 'Unexpected error';

export const stageObject: Record<StageObjectType, Stage> = {
  Default: { title: 'default', status: StageStatus.default },
  InProgress: {
    title: 'In progress',
    status: StageStatus.inProgress,
  },
  Success: {
    title: 'Transfer completed successfully',
    status: StageStatus.success,
  },
  ApiError: {
    title: 'API error',
    status: StageStatus.error,
    error: { name: 'API', message: 'API not found' },
  },
  TransferingError: {
    title: 'Transfering error',
    status: StageStatus.error,
    error: { name: 'Transfer', message: 'Transfering error' },
  },
  SigningError: {
    title: 'Signing error',
    status: StageStatus.error,
    error: { name: 'Transfer', message: 'Signing error' },
  },
  SumbittingError: {
    title: 'Submitting error',
    status: StageStatus.error,
    error: { name: 'Transfer', message: 'Submitting error' },
  },
  CalculatingFeeError: {
    title: 'Calculating fee error',
    status: StageStatus.error,
    error: { name: 'Fee', message: 'Calculating fee error' },
  },
  UnexpectedError: {
    title: unexpectedError,
    status: StageStatus.error,
    error: { name: unexpectedError, message: unexpectedError },
  },
};
