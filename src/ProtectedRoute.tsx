import { Loader } from '@unique-nft/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useAccounts } from './hooks';

const LoaderContainer = styled.div`
  margin: auto;
`;

export const ProtectedRoute: FC = ({ children }) => {
  const { isLoading } = useAccounts();

  if (isLoading) {
    return (
      <LoaderContainer>
        <Loader size="middle" />
      </LoaderContainer>
    );
  }

  return <>{children}</>;
};
