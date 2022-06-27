import React, { VFC } from 'react';
import { Modal } from '@unique-nft/ui-kit';

import { Stages } from '@app/components';
import { StageStatus } from '@app/types';

const stages = [
  {
    title: 'Transfer in progress',
    status: StageStatus.inProgress,
  },
];

export const TransferStagesModal: VFC = () => {
  return (
    <Modal isVisible isClosable={false}>
      <Stages stages={stages} />
    </Modal>
  );
};
