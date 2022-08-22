import React, { VFC } from 'react';
import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { Confirm } from '@app/components';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

interface AskBurnModalProps {
  fee: string;
  isVisible: boolean;
  onBurn(): void;
  onClose(): void;
}

export const AskBurnModal: VFC<AskBurnModalProps> = ({
  fee,
  isVisible,
  onBurn,
  onClose,
}) => {
  return (
    <Confirm
      isVisible={isVisible}
      title="Burn NFT"
      buttons={[{ title: 'Confirm', role: 'primary', onClick: onBurn }]}
      onClose={onClose}
    >
      <TextWrapper size="m" appearance="block">
        You will not be able to undo this action.
      </TextWrapper>
      <FeeInformationTransaction fee={fee} />
    </Confirm>
  );
};

const TextWrapper = styled(Text)`
  margin-bottom: calc(var(--prop-gap));
`;
