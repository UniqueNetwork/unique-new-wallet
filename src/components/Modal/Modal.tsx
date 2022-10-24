import React, { ReactNode } from 'react';
import { Button, Heading } from '@unique-nft/ui-kit';
import Drawer, { DrawerProps } from 'rc-drawer';
import classNames from 'classnames';
import './Modal.scss';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { ButtonGroup } from '@app/pages/components/FormComponents';

export interface ModalProps {
  children: ReactNode;
  footerButtons?: ReactNode;
  isVisible: boolean;
  isClosable?: boolean;
  inline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: ReactNode;
  onClose?(): void;
}

const maskMotion: DrawerProps['maskMotion'] = {
  motionAppear: true,
  motionName: 'mask-motion',
};

export const motion: DrawerProps['motion'] = (placement) => ({
  motionAppear: true,
  motionName: `panel-motion-${placement}`,
});

const motionProps: Partial<DrawerProps> = {
  maskMotion,
  motion,
};

export const Modal = ({
  children,
  footerButtons,
  isVisible,
  isClosable = true,
  inline,
  title,
  size = 'md',
  onClose,
}: ModalProps) => {
  const deviceSize = useDeviceSize();
  const headingSize = () => (deviceSize >= DeviceSize.md ? '2' : '3');

  return isVisible ? (
    <Drawer
      className={classNames(`unique-modal-content--${size}`, {
        'unique-modal-content--inline': inline,
      })}
      keyboard={isClosable}
      maskClosable={isClosable}
      open={isVisible}
      placement="top"
      prefixCls="unique-modal"
      onClose={onClose}
      {...motionProps}
    >
      {(title || isClosable) && (
        <div className="unique-modal-header">
          {title && <Heading size={headingSize()}>{title}</Heading>}
          {isClosable && (
            <Button
              className="unique-modal-close"
              title=""
              iconLeft={{ color: 'currentColor', name: 'close', size: 16 }}
              onClick={onClose}
            />
          )}
        </div>
      )}
      <div className="unique-modal-body">{children}</div>
      {footerButtons && (
        <div className="unique-modal-footer">
          <ButtonGroup stack align="flex-end">
            {footerButtons}
          </ButtonGroup>
        </div>
      )}
    </Drawer>
  ) : null;
};
