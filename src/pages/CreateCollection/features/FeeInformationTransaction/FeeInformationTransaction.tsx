import { memo, useEffect } from 'react';

import { useNotifications } from '@app/components';
import { FeeInformationTransaction as FeeInformationTransactionComponent } from '@app/components/FeeInformationTransaction';

import { useFeeContext } from '../../context';

const FeeInformationTransactionContainer = () => {
  const { feeFormatted, feeLoading, feeError } = useFeeContext();

  const { error } = useNotifications();

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  return (
    <FeeInformationTransactionComponent fee={feeFormatted} feeLoading={feeLoading} />
  );
};

export const FeeInformationTransaction = memo(FeeInformationTransactionContainer);
