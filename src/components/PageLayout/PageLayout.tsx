import { Layout } from '@unique-nft/ui-kit';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { usePageSettingContext } from '@app/context';

import { Header } from '../';

export const PageLayout: FC = () => {
  const { breadcrumbs, heading } = usePageSettingContext();

  return (
    <Wrapper className="page-layout">
      <LayoutStyled>
        <Layout breadcrumbs={breadcrumbs} header={<Header />} heading={heading}>
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
    margin-left: auto;
    margin-right: auto;
    padding-left: 24px;
    padding-right: 24px;

    @media screen and (min-width: 1024px) {
      padding-left: 32px;
      padding-right: 32px;
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

  .unique-tabs-labels {
    flex-wrap: nowrap;
  }
`;
