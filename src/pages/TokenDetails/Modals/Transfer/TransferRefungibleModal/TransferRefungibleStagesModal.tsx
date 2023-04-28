import { Stages } from '@app/components';
import { StageStatus } from '@app/types';
import { Modal } from '@app/components/Modal';

const stages = [
  {
    title: 'Transfer in progress',
    status: StageStatus.inProgress,
  },
];

export const TransferRefungibleStagesModal = () => {
  return (
    <Modal isVisible={true} isClosable={false} title="Transfer RFT">
      <Stages stages={stages} />
    </Modal>
  );
};
