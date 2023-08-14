import styled from 'styled-components';

import { Button, Modal, Typography } from '@app/components';
import { ModalFooter } from '@app/pages/components/ModalComponents';

import { NewToken } from '../types';

type RemovingModalProps = {
  isVisible?: boolean;
  tokens: NewToken[];
  onSubmit(): void;
  onClose(): void;
};

export const RemovingModal = ({
  isVisible = true,
  tokens,
  onSubmit,
  onClose,
}: RemovingModalProps) => {
  return (
    <Modal title="Removing" isVisible={isVisible} onClose={onClose}>
      <ModalContent>
        <Typography>{tokens.length} tokens will be removed. Are you sure?</Typography>
      </ModalContent>
      <ModalFooter>
        <Button role="outlined" title="Cancel" onClick={onClose} />
        <Button role="primary" title="Submit" onClick={onSubmit} />
      </ModalFooter>
    </Modal>
  );
};

export const ModalContent = styled.div`
  margin-bottom: 16px;
`;
