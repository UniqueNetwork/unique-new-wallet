import styled, { css } from 'styled-components';

export const commonPlateCss = css`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: var(--prop-border-radius);
  padding: calc(var(--prop-gap) * 2);
  background-color: var(--color-additional-light);
`;

export const MainWrapper = styled.div`
  @media screen and (min-width: 1025px) {
    display: flex;
    align-items: flex-start;
  }
`;

export const WrapperContent = styled.div`
  box-sizing: border-box;

  @media screen and (min-width: 1025px) {
    ${commonPlateCss};
    flex: 1 1 66.6666%;
  }
`;

export const WrapperSidebar = styled.aside`
  box-sizing: border-box;
  overflow: hidden;
  margin: calc(var(--prop-gap) * 2) 0;

  @media screen and (min-width: 1025px) {
    ${commonPlateCss};
    flex: 1 1 33.3333%;
    max-width: 600px;
    margin: 0 0 0 calc(var(--prop-gap) * 2);
  }

  @media only screen and (min-width: 1025px) and (max-width: 1500px) {
    margin: 0 0 0 calc(var(--prop-gap) * 1.5);
  }
`;

export const SidebarRow = styled.div`
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;

export const TabsHeader = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: calc(var(--prop-gap) * 2);

  @media screen and (min-width: 1024px) {
    border-bottom: 1px solid var(--color-grey-300);
    justify-content: space-between;
    padding: 0 calc(var(--prop-gap) * 2);
    gap: calc(var(--prop-gap) * 2);
  }

  .unique-tabs-labels {
    border-bottom: 1px solid var(--color-grey-300);
    flex: 1 1 100%;
    margin-bottom: calc(var(--prop-gap) * 1.5);

    @media screen and (min-width: 1024px) {
      flex: 0 0 auto;
      margin-bottom: 0;
    }

    &.slim {
      .tab-label {
        margin-bottom: -1px;
        padding: calc(var(--prop-gap) / 2) var(--prop-gap) calc(var(--prop-gap) * 1.5);
        height: auto;

        @media screen and (min-width: 1024px) {
          margin-bottom: 0;
          padding-top: calc(var(--prop-gap) * 2.5);
          padding-bottom: calc(var(--prop-gap) * 2.5);
        }

        &.active {
          color: var(--color-primary-500);
        }
      }
    }
  }

  .unique-tabs-contents {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    padding: 0;

    @media screen and (min-width: 1024px) {
      justify-content: flex-end;
      gap: calc(var(--prop-gap) * 2);
      max-width: 89%;
    }
  }
`;

export const TabsBody = styled.div`
  display: flex;
  flex: 1 1 auto;

  .unique-tabs-contents {
    flex: 1 1 100%;
    display: flex;
    padding-top: 0;
    padding-bottom: 0;
    max-width: 100%;
  }
`;
