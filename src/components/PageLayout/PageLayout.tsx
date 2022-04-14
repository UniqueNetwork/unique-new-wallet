import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { Header } from '../';
import Welcome from '../Welcome';
import { useAccounts, useFooter } from '@app/hooks';
import Loading from '../Loading';

import './PageLayout.scss';

export type TMenuItems = 'Minter';

export const PageLayout: FC = () => {
  const footer = useFooter();
  const { accounts, fetchAccounts, isLoading } = useAccounts();

  return (
    <LayoutStyled>
      <Layout
        footer={<div dangerouslySetInnerHTML={{ __html: footer }} />}
        header={<Header activeItem={'Minter'} />}
      >
        {isLoading && (
          <LoadingStyled>
            <Loading />
          </LoadingStyled>
        )}
        {!isLoading && accounts.length === 0 && (
          <Welcome fetchAccounts={fetchAccounts} />
        )}
        {!isLoading && accounts.length !== 0 && (
          <div className={'container'}>
            <Outlet />
          </div>
        )}
      </Layout>
    </LayoutStyled>
  );
};

const LoadingStyled = styled.div`
  position: relative;
  flex: 1;
  display: flex;
`;

const LayoutStyled = styled.div`
  .unique-layout__content {
    padding: 0 !important;
    background-color: transparent !important;
    box-shadow: none !important;
    display: flex;
    flex-direction: column;
    row-gap: calc(var(--gap) * 1.5);
  }

  main {
    > div {
      display: flex;
    }

    /* Todo: remove after done task https://cryptousetech.atlassian.net/browse/NFTPAR-1238 */
    .unique-breadcrumbs-wrapper {
      align-items: center;

      .breadcrumb-item {
        line-height: 22px;
      }
    }
  }

  header {
    @media (max-width: 1024px) {
      top: 0;
      position: sticky !important;
      z-index: 1000;
    }
    @media (max-width: 620px) {
      height: 80px !important;
    }
  }

  footer {
    @media (max-width: 568px) {
      height: unset;
    }
    & > div {
      display: flex;
      align-items: center;
      height: 64px;
      justify-content: space-between;
      width: 100%;
      @media (max-width: 568px) {
        padding: var(--gap) 0;
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }

  .unique-tabs-labels {
    flex-wrap: nowrap;
  }
`;
