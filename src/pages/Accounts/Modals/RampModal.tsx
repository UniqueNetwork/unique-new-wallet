import React, { memo, useEffect, VFC } from 'react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

import { Modal } from '@app/components/Modal';
import { config } from '@app/config';

// these sizes are required for embedded rendering method, because RampSdk checks them, when we initialize ramp object
// but required sizes are not convenient for users, and it causes of using other sizes after initialization
const requiredWidth = '100%';
const requiredHeight = '667px';
const rampContainerId = 'ramp-container';

interface RampModalProps {
  isVisible: boolean;
  swapAsset: string; // 'KSM' | 'DOT';
  onClose: () => void;
}

const RampModalComponent: VFC<RampModalProps> = ({ isVisible, swapAsset, onClose }) => {
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
          hostApiKey: config.rampApiKey,
        });

        // Ramp SDK has a few events, but the lib doesn't support them, just asterisk * (it means all events)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ramp.on('WIDGET_CLOSE', onClose);
        ramp.show();

        if (ramp.domNodes) {
          ramp.domNodes.iframe.width = '100%';
        }
      }
    }
  }, [isVisible]);

  return (
    <Modal inline isClosable={false} isVisible={isVisible} onClose={onClose}>
      <div
        className="unique-ramp-modal-wrapper"
        id={rampContainerId}
        style={{ width: requiredWidth, height: requiredHeight }}
      />
    </Modal>
  );
};

// we should use memoization, because ramp can be initialize once
export const RampModal = memo(RampModalComponent);
