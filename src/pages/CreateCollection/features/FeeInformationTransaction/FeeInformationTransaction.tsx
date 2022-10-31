import { memo } from 'react';

import { FeeInformationTransaction as FeeInformationTransactionComponent } from '@app/components/FeeInformationTransaction';

import { useFeeContext } from '../../context';

const FeeInformationTransactionContainer = () => {
  const { feeFormatted, feeLoading } = useFeeContext();

  return (
    <FeeInformationTransactionComponent fee={feeFormatted} feeLoading={feeLoading} />
  );
};

export const FeeInformationTransaction = memo(FeeInformationTransactionContainer);
