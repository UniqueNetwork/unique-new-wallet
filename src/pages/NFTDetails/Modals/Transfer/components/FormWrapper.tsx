import { ReactNode } from 'react';
import { Text } from '@unique-nft/ui-kit';

import { TransferRow } from '@app/pages/NFTDetails/Modals/Transfer/components/style';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { ModalContent } from '@app/pages/components/ModalComponents';
import { Alert } from '@app/components';

type Props = {
  children: ReactNode;
  fee?: string;
  feeWarning?: string;
};

export const FormWrapper = ({
  children,
  fee,
  feeWarning = 'A fee will be calculated after entering the address',
}: Props) => {
  return (
    <ModalContent>
      {children}
      <TransferRow>
        <Text>
          Proceed with caution, once confirmed the transaction cannot be reverted.
        </Text>
      </TransferRow>
      <TransferRow gap="sm">
        {fee ? (
          <FeeInformationTransaction fee={fee} />
        ) : (
          <Alert type="warning">{feeWarning}</Alert>
        )}
      </TransferRow>
    </ModalContent>
  );
};
