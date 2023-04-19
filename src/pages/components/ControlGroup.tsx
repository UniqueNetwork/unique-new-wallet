import styled from 'styled-components';

export const ControlGroup = styled.div`
  flex: 1 1 100%;
  display: flex;
  gap: var(--prop-gap);
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  div.unique-select {
    width: 100%;

    .select-wrapper {
      width: 100%;
      height: 40px;
      .select-value {
        font-size: 16px;
      }
    }
  }

  @media screen and (min-width: 1024px) {
    justify-content: flex-end;
    flex-direction: row;
    width: auto;
    align-items: center;

    div.unique-select {
      width: 208px;

      .select-wrapper {
        width: 208px;
      }
    }
  }
`;
