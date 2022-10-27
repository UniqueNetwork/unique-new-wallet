import { ReactNode } from 'react';
import { Alert, Text } from '@unique-nft/ui-kit';

import { TransferRow } from '@app/pages/NFTDetails/Modals/Transfer/components/style';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { ModalContent } from '@app/pages/components/ModalComponents';

type Props = {
  children: ReactNode;
  fee?: string;
};

export const FormWrapper = ({ children, fee }: Props) => {
  return (
    <ModalContent>
      {children}
      <TransferRow>
        <Text>
          Proceed with caution, once confirmed the transaction cannot be reverted.
        </Text>
      </TransferRow>
      <TransferRow>
        {fee ? (
          <FeeInformationTransaction fee={fee} />
        ) : (
          <Alert type="warning">
            A fee will be calculated after entering the address
          </Alert>
        )}
      </TransferRow>
    </ModalContent>
  );
};
