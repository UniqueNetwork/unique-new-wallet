type ExtrinsicFeeState = {
  fee: string;
  feeFormatted: string;
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
      fee: action?.payload?.fee || '',
      feeFormatted: action?.payload?.feeFormatted || '',
    },
    error: { ...state, isLoading: false, isError: true, ...action.payload },
  };

  return reducer[action.type] ?? state;
};
