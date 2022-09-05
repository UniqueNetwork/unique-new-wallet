import { ReactNode, useEffect, useState, VFC } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Button } from '@unique-nft/ui-kit';

import { DeviceSize, useDeviceSize } from '@app/hooks';

const PreviewDrawer = styled.div`
  position: fixed;
  z-index: 8;
  overflow: auto;
  top: 80px; // 64px
  bottom: 60px;
  left: 0;
  right: 0;
  margin: 0;
  background-color: #fff;
  padding: 0 var(--prop-gap);

  @media screen and (min-width: 768px) {
    top: 80px;
    padding: 0 calc(var(--prop-gap) * 1.5);
  }
`;

const BottomPanelWrapper = styled.div`
  height: 60px;
`;

const BottomPanel = styled.div`
  z-index: 8;
  box-shadow: 0 -8px 12px rgba(0, 0, 0, 0.06);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: calc(var(--prop-gap) / 1.6) var(--prop-gap);
  background-color: var(--color-additional-light);

  @media screen and (min-width: 768px) {
    padding-left: calc(var(--prop-gap) * 1.5);
    padding-right: calc(var(--prop-gap) * 1.5);
  }
`;

export const PreviewBar: VFC<{ children: ReactNode; parent: Element }> = ({
  children,
  parent,
}) => {
  const deviceSize = useDeviceSize();
  const [isVisible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return createPortal(
    <>
      {isVisible && <PreviewDrawer>{children}</PreviewDrawer>}
      <BottomPanelWrapper>
        <BottomPanel>
          <Button
            title={isVisible ? 'Back' : 'Preview'}
            wide={deviceSize < DeviceSize.md}
            onClick={() => setVisible(!isVisible)}
          />
        </BottomPanel>
      </BottomPanelWrapper>
    </>,
    parent,
  );
};
