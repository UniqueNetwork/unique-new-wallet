import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { usePageSettingContext } from '@app/context';

import { Header, Layout, Footer } from '../';

export const PageLayout: FC = () => {
  const { breadcrumbs, heading } = usePageSettingContext();

  return (
    <Wrapper className="page-layout">
      <LayoutStyled>
        <Layout
          header={<Header />}
          footer={<Footer />}
          breadcrumbs={breadcrumbs}
          heading={heading || undefined}
        >
          <Outlet />
        </Layout>
      </LayoutStyled>
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  .unique-layout__content {
    width: 100%;
    margin: 0 auto;
    max-width: var(--prop-container-width);
  }

  .container {
    width: 100%;
    max-width: var(--prop-container-width);
    padding: 0 var(--prop-gap);
    margin: 0 auto;
  }
`;

const LayoutStyled = styled.div`
  .unique-layout__content {
    padding: 0 !important;
    background-color: transparent !important;
    box-shadow: none !important;
    display: flex;
    flex-direction: column;
    row-gap: calc(var(--prop-gap) * 2);

    & > .unique-font-heading {
      margin-bottom: 0;
    }
  }

  main {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--prop-container-width);
    padding-left: 24px;
    padding-right: 24px;
    margin: 32px auto 0;

    @media screen and (max-width: 567px) {
      padding-left: 16px;
      padding-right: 16px;
    }

    @media screen and (min-width: 1024px) {
      padding-left: 32px;
      padding-right: 32px;
      min-height: calc(100vh - 80px - 32px);
    }

    > div {
      display: flex;
    }

    /* Todo: remove after done task https://cryptousetech.atlassian.net/browse/NFTPAR-1238 */
    .unique-breadcrumbs-wrapper {
      align-items: center;
      width: 100%;

      &:empty {
        display: none;
      }

      .breadcrumb-item {
        line-height: 22px;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .unique-font-heading + .unique-breadcrumbs-wrapper {
      margin-top: -16px;
    }
  }

  .unique-layout {
    min-width: 300px;

    & > header {
      top: 0;
      position: sticky;
      z-index: 49;

      @media (max-width: 620px) {
        height: 80px;
      }
    }

    & > main {
      padding-bottom: calc(var(--prop-gap) * 2.5);
    }

    & > footer {
      display: none;

      @media screen and (min-width: 1280px) {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 0;
      }
    }
  }
  .unique-tabs-labels {
    flex-wrap: nowrap;
  }
`;
