import styled from 'styled-components/macro';
import { Text } from '@unique-nft/ui-kit';

export const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: calc(var(--prop-gap) * 2);
`;

export const LabelText = styled(Text)`
  margin-bottom: calc(var(--prop-gap) / 4);
`;

export const AdditionalText = styled(Text)`
  margin-bottom: var(--prop-gap);
`;

export const ModalHeader = styled.div`
  margin-bottom: calc(var(--prop-gap) * 1.5);

  && h2 {
    margin-bottom: 0;
  }
`;

export const ModalContent = styled.div``;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const TextWarning = styled(Text)`
  border-radius: var(--prop-border-radius);
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  background-color: var(--color-additional-warning-100);
`;
