import React, { VFC } from 'react';

import { StageStatus } from '@app/types';
import { Stages } from '@app/components';
import { Modal } from '@app/components/Modal';

const stages = [
  {
    title: 'Burning fractional token',
    status: StageStatus.inProgress,
  },
];

export const BurnRefungibleStagesModal: VFC = () => {
  return (
    <Modal isVisible isClosable={false} title="Please wait">
      <Stages stages={stages} />
    </Modal>
  );
};
