import { ReactNode } from 'react';
import './Alert.scss';
import cn from 'classnames';

type AlertProps = {
  children: ReactNode;
  type: 'warning';
  className?: string;
};

export const Alert = ({ children, type, className }: AlertProps) => {
  return (
    <div className={cn(`unique-alert type-${type}`, className)}>
      <div>{children}</div>
    </div>
  );
};
