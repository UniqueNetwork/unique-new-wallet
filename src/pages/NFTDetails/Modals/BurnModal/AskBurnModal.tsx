import React, { VFC } from 'react';
import { Text, Loader } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { Confirm } from '@app/components';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

interface AskBurnModalProps {
  fee: string;
  isVisible: boolean;
  onBurn(): void;
  onClose(): void;
  isLoading: boolean;
}

export const AskBurnModal: VFC<AskBurnModalProps> = ({
  fee,
  isVisible,
  onBurn,
  onClose,
  isLoading,
}) => {
  return (
    <Confirm
      isClosable
      isVisible={isVisible}
      title="Burn NFT"
      buttons={[
        {
          title: 'Confirm',
          role: 'primary',
          onClick: onBurn,
          disabled: isLoading,
        },
      ]}
      onClose={onClose}
    >
      {isLoading && <Loader isFullPage={true} />}
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
