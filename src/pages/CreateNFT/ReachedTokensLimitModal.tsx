import { Button, Modal, ModalProps, Typography } from '@app/components';

type ReachedTokensLimitModalProps = Pick<ModalProps, 'isVisible' | 'onClose'>;

export const ReachedTokensLimitModal = ({
  isVisible,
  onClose,
}: ReachedTokensLimitModalProps) => {
  return (
    <Modal
      title="Tokens limit reached"
      isVisible={isVisible}
      footerButtons={<Button role="primary" title="Close" onClick={onClose} />}
      onClose={onClose}
    >
      <Typography>
        Unfortunately you&apos;ve reached token limit for&nbsp;your collection
      </Typography>
    </Modal>
  );
};
