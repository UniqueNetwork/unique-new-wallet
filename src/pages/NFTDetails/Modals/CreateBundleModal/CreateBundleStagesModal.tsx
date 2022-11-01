import { Stages } from '@app/components';
import { StageStatus } from '@app/types';
import { Modal } from '@app/components/Modal';

const stages = [
  {
    title: 'Nesting in progress',
    status: StageStatus.inProgress,
  },
];

export const CreateBundleStagesModal = () => {
  return (
    <Modal isVisible={true} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};
