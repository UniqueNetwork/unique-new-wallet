import { ExtrinsicResultResponse } from '@app/types/Api';

type SignAndSubmitExtrinsicStatus =
  | 'idle'
  | 'obtaining'
  | 'signing'
  | 'submitting'
  | 'checking'
  | 'success'
  | 'error';

type ExtrinsicFlowState = Pick<ExtrinsicResultResponse, 'parsed'> & {
  isError?: boolean;
  error?: Error | null;
  isLoading?: boolean;
  status?: SignAndSubmitExtrinsicStatus;
};

type ExtrinsicFlowActionType = 'startflow' | 'statusupdate' | 'error' | 'success';

type ExtrinsicFlowAction = {
  type: ExtrinsicFlowActionType;
  payload?: ExtrinsicFlowState;
};

export const extrinsicFlowReducer = (
  state: ExtrinsicFlowState,
  action: ExtrinsicFlowAction,
): ExtrinsicFlowState => {
  const reducer: Record<ExtrinsicFlowActionType, ExtrinsicFlowState> = {
    startflow: {
      ...state,
      error: null,
      isError: false,
      isLoading: true,
      parsed: undefined,
    },
    statusupdate: { ...state, status: action?.payload?.status, parsed: undefined },
    error: {
      ...state,
      error: action.payload?.error,
      isError: true,
      isLoading: false,
      status: 'error',
      parsed: undefined,
    },
    success: {
      ...state,
      status: 'success',
      isLoading: false,
      parsed: action.payload?.parsed,
      error: undefined,
      isError: false,
    },
  };

  return reducer[action.type] ?? state;
};
