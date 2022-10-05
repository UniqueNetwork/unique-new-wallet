import { Button, Text } from '@unique-nft/ui-kit';

import { Modal, ModalProps } from '@app/components/Modal';
import { ContentRow, ModalFooter } from '@app/pages/components/ModalComponents';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

type BurnCollectionModalProps = Omit<ModalProps, 'children'> & {
  onConfirm(): void;
};

export const BurnCollectionModal = ({
  onConfirm,
  ...modalProps
}: BurnCollectionModalProps) => (
  <Modal title="Burn collection" {...modalProps}>
    <ContentRow>
      <Text>You will not be able to undo this action.</Text>
    </ContentRow>
    <ContentRow>
      <FeeInformationTransaction fee="2.073447 QTZ" />
    </ContentRow>
    <ModalFooter>
      <Button role="primary" title="Confirm" onClick={onConfirm} />
    </ModalFooter>
  </Modal>
);
