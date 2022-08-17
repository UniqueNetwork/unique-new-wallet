import { Loader } from '@unique-nft/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useAccounts } from './hooks';
import { Welcome } from './pages';

const LoaderContainer = styled.div`
  margin: auto;
`;

export const ProtectedRoute: FC = ({ children }) => {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) {
    return (
      <LoaderContainer>
        <Loader size="middle" />
      </LoaderContainer>
    );
  }

  if (!accounts.length) {
    return <Welcome />;
  }

  return <>{children}</>;
};
