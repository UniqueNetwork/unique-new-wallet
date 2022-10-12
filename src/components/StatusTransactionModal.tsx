import { Loader } from '@unique-nft/ui-kit';

import { Modal, ModalProps } from '@app/components/Modal';

type Props = Pick<ModalProps, 'isVisible'> & {
  description: string;
  isVisible: boolean;
  title?: string;
};

export const StatusTransactionModal = ({
  description,
  title = 'Please wait',
  isVisible,
}: Props) => {
  return (
    <Modal isVisible={isVisible} isClosable={false} title={title}>
      <Loader label={description} />
    </Modal>
  );
};
