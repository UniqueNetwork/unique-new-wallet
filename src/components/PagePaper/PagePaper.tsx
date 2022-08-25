import styled, { css } from 'styled-components';

export const PagePaperStyles = css`
  flex: 1 1 auto;

  @media screen and (min-width: 1024px) {
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    border-radius: var(--prop-border-radius);
    background: var(--color-additional-light);
  }
`;

export const PagePaper = styled.div<{
  flexLayout?: 'row' | 'column' | undefined;
  noPadding?: boolean;
}>`
  ${PagePaperStyles};
  display: ${(p) => (p.flexLayout ? 'flex' : undefined)};
  flex-direction: ${(p) => p.flexLayout};
  padding: ${(p) => (p.noPadding ? undefined : 'calc(var(--prop-gap) * 2)')};
`;
