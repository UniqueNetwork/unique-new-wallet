import { ReactNode } from 'react';
import styled from 'styled-components';

import { Modal, ModalProps } from '@app/components/Modal';

import { Alert } from './Alert';
import { Loader } from './Loader';

type Props = Pick<ModalProps, 'isVisible'> & {
  description: string;
  isVisible: boolean;
  title?: string;
  warning?: ReactNode;
};

export const StatusTransactionModal = ({
  description,
  title = 'Please wait',
  isVisible,
  warning,
}: Props) => {
  return (
    <Modal isVisible={isVisible} isClosable={false} title={title}>
      <Loader label={description} />
      {!!warning && <AlertStyled type="warning">{warning}</AlertStyled>}
    </Modal>
  );
};

const AlertStyled = styled(Alert)`
  margin-top: calc(var(--prop-gap) * 1.5);
  margin-bottom: 0 !important;
`;
