/**
 * @author Pavel Kalachev <pkalachev@usetech.com>
 */

import classNames from 'classnames';
import { VFC } from 'react';

import { Icon, IconProps } from '../Icon';
import './Chip.scss';

export interface ChipProps {
  label: string;
  iconLeft?: IconProps;
  onClose?(): void;
}

export const Chip: VFC<ChipProps> = ({ label, iconLeft, onClose }) => (
  <span
    className={classNames('unique-chip', {
      'icon-left': iconLeft,
    })}
  >
    {iconLeft && <Icon {...iconLeft} />}
    {label}
    <span onClick={onClose}>
      <Icon name="close" size={11} />
    </span>
  </span>
);
