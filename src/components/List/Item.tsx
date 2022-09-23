import { HTMLAttributes, ReactNode } from 'react';

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

const Item = ({ children, className }: ListItemProps) => {
  return (
    <div className={className} role="listitem">
      {children}
    </div>
  );
};

export default Item;
