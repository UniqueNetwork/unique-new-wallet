import classNames from 'classnames';

import './Avatar.scss';
import Empty from '../../static/empty.svg';

export interface IAvatarProps {
  src?: string;
  size?: number | string;
  defaultSrc?: string;
  type?: 'circle' | 'square';
  className?: string;
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
}

export const Avatar = ({
  src,
  size = 38,
  type = 'square',
  fit,
  className,
}: IAvatarProps) => (
  <img
    width={size}
    height={size}
    className={classNames(`unique-avatar ${type}`, className)}
    {...(fit && {
      style: {
        objectFit: fit,
      },
    })}
    src={src?.length ? src : Empty}
  />
);
