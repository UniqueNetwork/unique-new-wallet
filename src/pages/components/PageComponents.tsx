import styled, { css } from 'styled-components';

export const commonPlateCss = css`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: var(--prop-border-radius);
  padding: calc(var(--prop-gap) * 2);
  background-color: var(--color-additional-light);
`;

export const MainWrapper = styled.div`
  @media screen and (min-width: 1024px) {
    display: flex;
    align-items: flex-start;
  }
`;

export const WrapperContent = styled.div`
  box-sizing: border-box;
  flex: 1 1 66.6666%;

  @media screen and (min-width: 1024px) {
    ${commonPlateCss};
  }
`;

export const WrapperSidebar = styled.aside`
  box-sizing: border-box;
  flex: 1 1 33.3333%;
  max-width: 600px;
  margin: calc(var(--prop-gap) * 3) 0;

  @media screen and (min-width: 1024px) {
    ${commonPlateCss};
    margin: 0 0 0 calc(var(--prop-gap) * 2);
  }
`;

export const SidebarRow = styled.div`
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;
