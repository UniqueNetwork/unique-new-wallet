import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { TransferRow } from '@app/pages/TokenDetails/Modals/Transfer/components/TransferRow';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { ModalContent } from '@app/pages/components/ModalComponents';
import { Loader, Typography, Alert } from '@app/components';

type Props = {
  children: ReactNode;
  fee?: string;
  feeWarning?: string;
  feeLoading?: boolean;
};

export const FormWrapper = ({
  children,
  fee,
  feeWarning = 'A fee will be calculated after entering the address',
  feeLoading,
}: Props) => {
  const feeContent = fee ? (
    <FeeInformationTransaction fee={fee} />
  ) : (
    <Alert type="warning">{feeWarning}</Alert>
  );

  const feeComponent = feeLoading ? (
    <Alert type="warning">
      <FeeLoader>
        <Loader size="small" label="Loading" placement="left" />
      </FeeLoader>
    </Alert>
  ) : (
    feeContent
  );

  return (
    <ModalContent>
      {children}
      <TransferRow>
        <Typography>
          Proceed with caution, once confirmed the transaction cannot be reverted.
        </Typography>
      </TransferRow>
      <TransferRow gap="sm">{feeComponent}</TransferRow>
    </ModalContent>
  );
};

export const FeeLoader = styled.span`
  .unique-loader {
    .loader {
      width: var(--prop-gap);
      height: var(--prop-gap);
      border-top-color: var(--color-primary-500);
      border-left-color: var(--color-primary-500);
    }

    .loader-label {
      font-size: var(--prop-font-size);
      font-weight: calc(var(--prop-font-weight) + 100);
      color: var(--color-primary-500);
    }
  }
`;
