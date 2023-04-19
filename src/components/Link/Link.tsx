import { AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';
import './Link.scss';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  title?: string;
  className?: string;
  role?: 'primary' | 'secondary' | 'danger';
  onClick?(): void;
}

export const Link = ({
  children,
  title,
  role = 'primary',
  className,
  ...rest
}: LinkProps) => (
  <a className={classNames(`unique-link ${role}`, className)} {...rest}>
    {children || title}
  </a>
);
