type ExtrinsicFeeState = {
  amount?: string;
  amountFormatted?: string;
  isError?: boolean;
  error?: Error | null;
  isLoading?: boolean;
};

type ExtrinsicFeeActionType = 'loading' | 'error' | 'success';

type ExtrinsicFeeAction = {
  type: ExtrinsicFeeActionType;
  payload?: ExtrinsicFeeState;
};

export const extrinsicFeeReducer = (
  state: ExtrinsicFeeState,
  action: ExtrinsicFeeAction,
) => {
  const reducer: Record<ExtrinsicFeeActionType, ExtrinsicFeeState> = {
    loading: { ...state, error: null, isError: false, isLoading: true },
    success: {
      ...state,
      isLoading: false,
      amount: action?.payload?.amount,
      amountFormatted: action?.payload?.amountFormatted,
    },
    error: { ...state, isLoading: false, isError: true, error: action?.payload?.error },
  };

  return reducer[action.type] ?? state;
};
