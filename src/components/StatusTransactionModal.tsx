import { Heading, Modal, Loader, ModalProps } from '@unique-nft/ui-kit';

type Props = Pick<ModalProps, 'isVisible'> & {
  title?: string;
  description: string;
};

export const StatusTransactionModal = ({
  title = 'Please wait',
  description,
  ...modalProps
}: Props) => (
  <Modal {...modalProps}>
    <Heading>{title}</Heading>
    <Loader label={description} />
  </Modal>
);
