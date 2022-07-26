import { ControllerProps } from 'react-hook-form';

export type BaseControllerProps<T> = Omit<T, 'name'> &
  Pick<ControllerProps, 'name' | 'control' | 'rules' | 'defaultValue'>;
