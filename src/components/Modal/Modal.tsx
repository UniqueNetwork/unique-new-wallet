import React, { ReactNode } from 'react';
import { Button, Heading } from '@unique-nft/ui-kit';
import Drawer, { DrawerProps } from 'rc-drawer';
import classNames from 'classnames';
import './Modal.scss';

import { DeviceSize, useDeviceSize } from '@app/hooks';

export interface ModalProps {
  children: ReactNode;
  isVisible: boolean;
  isClosable?: boolean;
  inline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  onClose?(): void;
}

const maskMotion: DrawerProps['maskMotion'] = {
  motionAppear: true,
  motionName: 'mask-motion',
  onAppearEnd: console.warn,
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
  isVisible,
  isClosable = true,
  inline,
  title,
  size = 'md',
  onClose,
}: ModalProps) => {
  const deviceSize = useDeviceSize();
  const headingSize = () => {
    switch (deviceSize) {
      case DeviceSize.md:
        return '2';
      default:
        return '3';
    }
  };

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
    </Drawer>
  ) : null;
};
