import React from 'react';
import { Heading, Modal } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

interface IMobileModalActionsProps {
  isVisible: boolean;
  onClose(): void;
  children?: React.ReactNode;
}

function MobileModalActions({ isVisible, onClose, children }: IMobileModalActionsProps) {
  return (
    <ModalWrapper>
      <Modal isClosable={true} isVisible={isVisible} onClose={onClose}>
        <HeadingWrapper>
          <Heading size="3">Choose the action</Heading>
        </HeadingWrapper>
        {children}
      </Modal>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div`
  @media (max-width: 767px) {
    flex-direction: column;
    row-gap: var(--gap);
  }

  & .unique-modal-wrapper {
    .unique-modal {
      @media (max-width: 567px) {
        padding: 24px 16px;
        width: calc(304px - (var(--gap) * 3));
      }

      @media (max-width: 767px) {
        width: calc(520px - (var(--gap) * 3));
      }
    }
  }
`;

const HeadingWrapper = styled.div`
  margin-bottom: 24px;
  margin-top: 3px;
`;

export default MobileModalActions;
