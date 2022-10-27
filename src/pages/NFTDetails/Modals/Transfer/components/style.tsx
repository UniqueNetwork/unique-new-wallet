import styled from 'styled-components';

export const TransferRow = styled.div`
  & + & {
    margin-top: calc(var(--prop-gap) * 1.5);
  }

  .unique-input-text {
    width: 100%;

    label {
      display: flex;
      align-items: center;
      gap: calc(var(--prop-gap) / 2.5);
    }
  }
`;
