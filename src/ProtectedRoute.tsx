import { Loader } from '@unique-nft/ui-kit';
import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from './hooks';
import { Welcome } from './pages';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from './routes';

const LoaderContainer = styled.div`
  margin: auto;
`;

export const ProtectedRoute: FC = ({ children }) => {
  const { pathname } = useLocation();
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

  if (pathname === ROUTE.BASE) {
    return <Navigate replace to={`${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`} />;
  }

  return <>{children}</>;
};
