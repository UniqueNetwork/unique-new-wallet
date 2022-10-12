import React, { VFC } from 'react';

import { StageStatus } from '@app/types';
import { Stages } from '@app/components';
import { Modal } from '@app/components/Modal';

const stages = [
  {
    title: 'Burn in progress',
    status: StageStatus.inProgress,
  },
];

export const BurnStagesModal: VFC = () => {
  return (
    <Modal isVisible isClosable={false} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};
