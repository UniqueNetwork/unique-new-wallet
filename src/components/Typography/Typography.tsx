import { ReactNode } from 'react';
import classNames from 'classnames';

import './Typography.scss';
import { ComponentProps } from '../types';

export interface ITextBaseProps {
  children: ReactNode;
  size?: 'xs' | 's' | 'm' | 'l';
  weight?: 'light' | 'regular' | 'bold';
  color?: string;
  appearance?: 'inline' | 'block';
}

export type TextProps = ITextBaseProps &
  Pick<ComponentProps, 'className' | 'id' | 'testid'>;

export const Typography = ({
  children,
  size = 'm',
  weight = 'regular',
  color = 'secondary-500',
  className,
  appearance = 'inline',
  testid,
  ...rest
}: TextProps) => {
  return (
    <span
      className={classNames(
        'unique-text',
        `size-${size}`,
        `weight-${weight}`,
        `color-${color}`,
        `appearance-${appearance}`,
        className,
      )}
      data-testid={testid}
      {...rest}
    >
      {children}
    </span>
  );
};
