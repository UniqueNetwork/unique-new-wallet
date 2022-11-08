import { ReactNode, useEffect } from 'react';
import DrawerPopup, { DrawerPopupProps } from 'rc-drawer/lib/DrawerPopup';
import classNames from 'classnames';
import { Button, Heading } from '@unique-nft/ui-kit';

import './Modal.scss';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { ButtonGroup } from '@app/pages/components/FormComponents';

export interface ModalProps {
  align?: 'top' | 'middle' | 'bottom';
  children: ReactNode;
  footerButtons?: ReactNode;
  isVisible: boolean;
  isClosable?: boolean;
  inline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: ReactNode;
  onClose?(): void;
}

const maskMotion: DrawerPopupProps['maskMotion'] = {
  motionAppear: true,
  motionName: 'mask-motion',
};

export const motion: DrawerPopupProps['motion'] = (placement) => ({
  motionAppear: true,
  motionName: `panel-motion-${placement}`,
});

const motionProps: Partial<DrawerPopupProps> = {
  maskMotion,
  motion,
};

export const Modal = ({
  align = 'middle',
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

  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return isVisible ? (
    <DrawerPopup
      className={classNames({ 'unique-modal-content--inline': inline })}
      contentWrapperStyle={{ verticalAlign: align }}
      keyboard={isClosable}
      mask={true}
      maskClassName={classNames(`unique-modal-mask-${align}`)}
      maskClosable={isClosable}
      open={isVisible}
      placement="left"
      prefixCls="unique-modal"
      rootClassName={classNames(`unique-modal-${align}`, `unique-modal--${size}`)}
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
    </DrawerPopup>
  ) : null;
};
