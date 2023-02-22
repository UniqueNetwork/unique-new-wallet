import { Text, Loader } from '@unique-nft/ui-kit';

import { Modal, ModalProps } from '@app/components/Modal';
import { ContentRow } from '@app/pages/components/ModalComponents';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { Button } from '@app/components';

type BurnCollectionModalProps = Omit<
  ModalProps,
  'children' | 'footerButtons' | 'title'
> & {
  onConfirm(): void;
  fee: string;
  isLoading: boolean;
};

export const BurnCollectionModal = ({
  onConfirm,
  fee,
  isLoading,
  ...modalProps
}: BurnCollectionModalProps) => (
  <Modal
    title="Burn collection"
    footerButtons={
      <Button role="primary" title="Confirm" disabled={isLoading} onClick={onConfirm} />
    }
    {...modalProps}
  >
    {isLoading && <Loader isFullPage={true} />}
    <ContentRow>
      <Text>You will not be able to undo this action.</Text>
    </ContentRow>
    <ContentRow>
      <FeeInformationTransaction fee={fee} />
    </ContentRow>
  </Modal>
);
