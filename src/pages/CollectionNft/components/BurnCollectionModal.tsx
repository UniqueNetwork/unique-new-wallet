import { Button, Heading, Modal, Text, ModalProps } from '@unique-nft/ui-kit';

import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

type BurnCollectionModalProps = Omit<ModalProps, 'children'> & {
  onConfirm(): void;
};

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
        <FeeInformationTransaction fee="2.073447 QTZ" />
      </ContentRow>
      <ModalFooter>
        <Button role="primary" title="Confirm" onClick={onConfirm} />
      </ModalFooter>
    </ModalContent>
  </Modal>
);
