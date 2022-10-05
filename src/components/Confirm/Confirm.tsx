import { ReactNode, VFC } from 'react';
import { Button, ButtonProps } from '@unique-nft/ui-kit';

import { Modal } from '@app/components/Modal';

interface IConfirmProps {
  children?: ReactNode;
  isClosable?: boolean;
  isVisible?: boolean;
  title?: string;
  buttons?: ButtonProps[];
  onCancel?(): void;
  onConfirm?(): void;
  onClose(): void;
}

export const Confirm: VFC<IConfirmProps> = ({
  buttons,
  children,
  isClosable,
  isVisible = false,
  title = '',
  onCancel,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal
      footerButtons={
        buttons &&
        buttons.map((btn, i) => (
          <Button role={btn.role} title={btn.title} key={i} onClick={btn.onClick} />
        ))
      }
      isClosable={isClosable}
      isVisible={isVisible}
      title={title}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};
