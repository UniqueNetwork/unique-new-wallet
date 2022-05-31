import { Button, Heading, Modal, Text, ModalProps } from '@unique-nft/ui-kit';

import { Alert } from '@app/components';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';

type BurnCollectionModalProps = Omit<ModalProps, 'children'> & {
  onConfirm(): void;
};

// TODO: wait rest api for fee
export const BurnCollectionModal = ({
  onConfirm,
  ...modalProps
}: BurnCollectionModalProps) => (
  <Modal {...modalProps} isClosable={true}>
    <ModalContent>
      <ContentRow>
        <Heading size="2">Burn collection</Heading>
        <Text>You will not be able to undo this action.</Text>
      </ContentRow>
      <ContentRow>
        <Alert type="warning">
          A fee of ~ 2.073447 QTZ can be applied to the transaction
        </Alert>
      </ContentRow>
      <ModalFooter>
        <Button role="primary" title="Confirm" onClick={onConfirm} />
      </ModalFooter>
    </ModalContent>
  </Modal>
);
