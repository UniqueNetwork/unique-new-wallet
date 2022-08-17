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

export const InnerWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

export const InnerSidebar = styled.div`
  border-right: 1px solid var(--color-grey-300);
  flex: 0 0 235px;
  padding: calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 1.5) 0
    calc(var(--prop-gap) * 2);
`;

export const InnerContent = styled.div`
  display: flex;
  flex: 1 1 auto;

  @media (max-width: 1025px) {
    padding-left: 0;
  }
`;

export const TabsHeader = styled.div`
  border-bottom: 1px solid var(--color-grey-300);
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(var(--prop-gap) * 2);
`;

export const TabsBody = styled.div`
  display: flex;
  flex: 1 1 auto;

  .unique-tabs-contents {
    flex: 1 1 100%;
    display: flex;
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export const GridListCommon = styled.div`
  flex: 1 1 auto;
  display: grid;
  align-content: baseline;
  gap: calc(var(--prop-gap) * 2);
`;
