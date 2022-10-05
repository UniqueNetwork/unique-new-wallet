import styled from 'styled-components/macro';

export const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: calc(var(--prop-gap) * 2);

  .unique-input-text {
    width: 100%;
  }
`;

export const ModalContent = styled.div``;

export const ModalFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: var(--prop-gap);
`;
