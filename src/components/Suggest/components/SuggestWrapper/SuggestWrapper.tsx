import { ReactNode } from 'react';

import { SuggestProps } from '../../Suggest';

export type SuggestWrapperProps<T> = Pick<SuggestProps<T>, 'suggestions'> & {
  children(suggest: T[]): ReactNode;
};

export const SuggestWrapper = <T,>({ children, suggestions }: SuggestWrapperProps<T>) => (
  <div>{children(suggestions)}</div>
);
