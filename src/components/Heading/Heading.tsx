import classNames from 'classnames';
import './Heading.scss';
import { ReactNode } from 'react';

import { ComponentProps } from '../types';

export interface IHeadingBaseProps {
  children: ReactNode;
  size?: '1' | '2' | '3' | '4';
}

export type HeadingProps = IHeadingBaseProps &
  Pick<ComponentProps, 'className' | 'testid'>;

export const Heading = ({ children, size = '1', className, testid }: HeadingProps) => {
  const Component = `h${size}` as keyof JSX.IntrinsicElements;
  return (
    <Component
      className={classNames('unique-font-heading', `size-${size}`, className)}
      data-testid={testid}
    >
      {children}
    </Component>
  );
};
