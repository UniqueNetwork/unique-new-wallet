import React, { VFC } from 'react';

import { StageStatus } from '@app/types';
import { Stages } from '@app/components';
import { Modal } from '@app/components/Modal';

const stages = [
  {
    title: 'Transfer in progress',
    status: StageStatus.inProgress,
  },
];

export const NestRefungibleStagesModal: VFC = () => {
  return (
    <Modal isVisible isClosable={false} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};
