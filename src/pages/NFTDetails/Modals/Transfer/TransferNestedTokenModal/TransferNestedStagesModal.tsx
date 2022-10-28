import { Stages } from '@app/components';
import { StageStatus } from '@app/types';
import { Modal } from '@app/components/Modal';

const stages = [
  {
    title: 'Transfer in progress',
    status: StageStatus.inProgress,
  },
];

export const TransferNestedStagesModal = () => {
  return (
    <Modal isVisible={true} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};
