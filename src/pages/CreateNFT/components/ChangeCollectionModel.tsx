import styled from 'styled-components';

import { Button, Modal, Typography } from '@app/components';
import { ModalFooter } from '@app/pages/components/ModalComponents';
import { Collection } from '@app/api/graphQL/types';

type RemovingModalProps = {
  isVisible?: boolean;
  collection?: Collection;
  onSubmit(): void;
  onClose(): void;
};

export const ChangeCollectionModal = ({
  isVisible = true,
  collection,
  onSubmit,
  onClose,
}: RemovingModalProps) => {
  return (
    <Modal title="Changing collection" isVisible={isVisible} onClose={onClose}>
      <ModalContent>
        <Typography>
          When changing the collection, the attribute values will be cleared. Are you
          sure?
        </Typography>
      </ModalContent>
      <ModalFooter>
        <Button role="outlined" title="Cancel" onClick={onClose} />
        <Button role="primary" title="Submit" onClick={onSubmit} />
      </ModalFooter>
    </Modal>
  );
};

export const ModalContent = styled.div`
  margin-bottom: var(--prop-gap);
`;
