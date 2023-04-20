import React, { VFC } from 'react';

import { StageStatus } from '@app/types';
import { Stages } from '@app/components';
import { Modal } from '@app/components/Modal';

const stages = [
  {
    title: 'Unnest in progress',
    status: StageStatus.inProgress,
  },
];

export const UnnestRefungibleStagesModal: VFC = () => {
  return (
    <Modal isVisible isClosable={false} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};
