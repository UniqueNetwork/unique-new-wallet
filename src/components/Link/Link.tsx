import { AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';
import './Link.scss';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  title?: string;
  className?: string;
  role?: 'primary' | 'secondary' | 'danger';
  size?: 'medium' | 'small';
  onClick?(): void;
}

export const Link = ({
  children,
  title,
  role = 'primary',
  size = 'small',
  className,
  ...rest
}: LinkProps) => (
  <a className={classNames(`unique-link ${role} ${size}`, className)} {...rest}>
    {children || title}
  </a>
);
