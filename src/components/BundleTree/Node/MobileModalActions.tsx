import { ReactNode } from 'react';

import { Modal } from '@app/components';

interface IMobileModalActionsProps {
  children?: ReactNode;
  isVisible: boolean;
  onClose(): void;
}

function MobileModalActions({ isVisible, onClose, children }: IMobileModalActionsProps) {
  return (
    <Modal isVisible={isVisible} title="Choose the action" onClose={onClose}>
      {children}
    </Modal>
  );
}

export default MobileModalActions;
