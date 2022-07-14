import { AxiosError } from 'axios';

type SignAndSubmitExtrinsicStatus =
  | 'idle'
  | 'obtaining'
  | 'signing'
  | 'submitting'
  | 'checking'
  | 'success'
  | 'error';

type ExtrinsicFlowState = {
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
    startflow: { ...state, error: null, isError: false, isLoading: true },
    statusupdate: { ...state, status: action?.payload?.status },
    error: {
      ...state,
      error: action.payload?.error,
      isError: true,
      isLoading: false,
      status: 'error',
    },
    success: { ...state, status: 'success', isLoading: false },
  };

  return reducer[action.type] ?? state;
};
