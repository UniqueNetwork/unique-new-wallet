import { Button, Heading, Modal, Text, ModalProps } from '@unique-nft/ui-kit';
import { useEffect } from 'react';

import { Alert } from '@app/components';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import { useFee } from '@app/hooks';

type BurnCollectionModalProps = Omit<ModalProps, 'children'> & {
  onConfirm(): void;
};

// TODO: wait rest api for fee https://cryptousetech.atlassian.net/browse/SDK-50
export const BurnCollectionModal = ({
  onConfirm,
  ...modalProps
}: BurnCollectionModalProps) => {
  const { fee, calculate } = useFee();

  useEffect(() => {
    (async () => {
      // todo burn collection mutation
      // calculate(extrinsic as UnsignedExtrinsicDTO);
    })();
  }, []);

  return (
    <Modal {...modalProps} isClosable={true}>
      <ModalContent>
        <ContentRow>
          <Heading size="2">Burn collection</Heading>
          <Text>You will not be able to undo this action.</Text>
        </ContentRow>
        <ContentRow>
          <Alert type="warning">A fee of ~ {fee} can be applied to the transaction</Alert>
        </ContentRow>
        <ModalFooter>
          <Button role="primary" title="Confirm" onClick={onConfirm} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
