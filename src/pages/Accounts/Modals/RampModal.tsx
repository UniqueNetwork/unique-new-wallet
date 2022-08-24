import React, { memo, useEffect, useLayoutEffect, VFC } from 'react';
import styled from 'styled-components';
import { Modal } from '@unique-nft/ui-kit';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

// these sizes are required for embedded rendering method, because RampSdk cheks them, when we initialize ramp object
// but required sizes are not convenient for users and it causes of using other sizes after initialization
const requiredWidth = '375px';
const requiredHeight = '667px';
const convenientHeight = '580px';

const rampContainerId = 'ramp-container';

interface RampModalProps {
  className?: string;
  isVisible: boolean;
  swapAsset: 'KSM' | 'DOT';
  onClose: () => void;
}

const RampModalComponent: VFC<RampModalProps> = ({
  className,
  isVisible,
  swapAsset,
  onClose,
}) => {
  useLayoutEffect(() => {
    if (isVisible) {
      const body = document.getElementsByTagName('body')[0];

      body.style.overflow = 'hidden';

      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const rampContainer = document.getElementById(rampContainerId);
      const logoUrl = `${window.location.origin}/logos/logo.svg`;
      if (rampContainer) {
        const ramp = new RampInstantSDK({
          hostAppName: 'Unique',
          variant: 'embedded-mobile',
          hostLogoUrl: logoUrl,
          containerNode: rampContainer,
          swapAsset,
        });

        rampContainer.style.height = convenientHeight;

        // Ramp SDK has a few events, but the lib doesn't support them, just asterisk * (it means all events)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ramp.on('WIDGET_CLOSE', onClose);
        ramp.show();

        return () => {
          rampContainer.style.height = requiredHeight;
        };
      }
    }
  }, [isVisible]);

  return (
    <span className={className}>
      <Modal isClosable isVisible={isVisible} onClose={onClose}>
        <div
          id={rampContainerId}
          style={{ width: requiredWidth, height: requiredHeight }}
        />
      </Modal>
    </span>
  );
};

const RampModalStyled = styled(RampModalComponent)`
  .unique-modal {
    width: ${requiredWidth};
  }
  .unique-modal-wrapper {
    padding: var(--prop-gap) 0;
  }
`;

// we should use memoization, because ramp can be initialize once
export const RampModal = memo(RampModalStyled);
