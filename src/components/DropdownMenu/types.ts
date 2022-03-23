import { ButtonProps } from '@unique-nft/ui-kit/dist/cjs/types';
import { ReactNode } from 'react';

export type DropdownMenuProps = Omit<ButtonProps, 'onClick'> & {
  children: ReactNode[]
};

export type DropdownMenuItemProps = {
  onClick(): void
};
