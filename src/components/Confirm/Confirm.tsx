import { ReactNode, VFC } from 'react';
import { ButtonProps } from '@unique-nft/ui-kit';

import { Modal } from '@app/components/Modal';

import { Button } from '../Button';

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
      footerButtons={buttons?.map((btn, i) => (
        <Button key={i} {...btn} />
      ))}
      isClosable={isClosable}
      isVisible={isVisible}
      title={title}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};
