import styled from 'styled-components';

export const PagePaper = styled.div`
  background: var(--color-additional-light);
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  border-radius: 4px;
  padding: calc(var(--gap) * 2);
  flex: 1;

  @media (max-width: 1024px) {
    background: var(--color-additional-light);
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
`;
