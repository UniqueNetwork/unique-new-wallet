import styled, { css } from 'styled-components';

export const PagePaperStyles = css`
  background: var(--color-additional-light);
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  border-radius: 4px;
  flex: 1;

  @media (max-width: 1024px) {
    background: var(--color-additional-light);
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
`;

export const PagePaper = styled.div`
  ${PagePaperStyles};
  padding: calc(var(--gap) * 2);
`;

export const PagePaperNoPadding = styled.div`
  ${PagePaperStyles};
`;
