const defaultGasFee = 0.03211372;

export const useMetamaskFee = () => {
  const getFee = () => {}; // noop

  return {
    fee: defaultGasFee,
    feeFormatted: defaultGasFee.toString(),
    getFee,
    feeStatus: 'success',
    feeLoading: false,
    feeError: undefined,
  };
};
