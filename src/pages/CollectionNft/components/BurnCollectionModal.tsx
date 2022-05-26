import { Button, Heading, Modal, Text, ModalProps } from '@unique-nft/ui-kit';

type BurnCollectionModalProps = Omit<ModalProps, 'children'> & {
  onConfirm(): void;
};

export const BurnCollectionModal = ({
  onConfirm,
  ...modalProps
}: BurnCollectionModalProps) => {
  return (
    <Modal {...modalProps} isClosable={true}>
      <Heading size={'2'}>Burn collection</Heading>
      <Text>You will not be able to undo this action.</Text>
      <Button title="Confirm" onClick={onConfirm} />
    </Modal>
  );
};
