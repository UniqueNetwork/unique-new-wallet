import { ReactNode, VFC } from 'react';
import styled from 'styled-components';
import { Button, ButtonProps, Heading, Modal } from '@unique-nft/ui-kit';

interface IConfirmProps {
  children?: ReactNode;
  isVisible?: boolean;
  title?: string;
  buttons?: ButtonProps[];
  onCancel?(): void;
  onConfirm?(): void;
  onClose(): void;
}

const Body = styled.div``;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: calc(var(--prop-gap) * 1.5);

  @media screen and (min-width: 540px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  .unique-button {
    flex: 1 1 auto;
    margin-top: calc(var(--prop-gap) / 2);
    white-space: nowrap;

    @media screen and (min-width: 540px) {
      flex-grow: 0;
    }

    & + .unique-button {
      @media screen and (min-width: 540px) {
        margin-left: calc(var(--prop-gap) / 2);
      }
    }
  }
`;

export const Confirm: VFC<IConfirmProps> = ({
  buttons,
  children,
  isVisible = false,
  title = '',
  onCancel,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal isVisible={isVisible} isClosable={true} onClose={onClose}>
      <Heading size="2">{title}</Heading>
      <Body>{children}</Body>
      {buttons && (
        <Footer>
          {buttons.map((btn, i) => (
            <Button role={btn.role} title={btn.title} key={i} onClick={btn.onClick} />
          ))}
        </Footer>
      )}
    </Modal>
  );
};
