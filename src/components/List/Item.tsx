import { HTMLAttributes, ReactNode, VFC } from 'react';

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

const Item: VFC<ListItemProps> = ({ children, className }) => {
  return (
    <div className={className} role="listitem">
      {children}
    </div>
  );
};

export default Item;
