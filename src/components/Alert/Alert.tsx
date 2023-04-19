import { ReactNode } from 'react';
import cn from 'classnames';
import styled from 'styled-components';

type AlertProps = {
  children: ReactNode;
  type: 'warning' | 'error';
  className?: string;
};

export const Alert = ({ children, type, className }: AlertProps) => {
  return (
    <AlertStyledWrapper className={cn(`unique-alert ${type}`, className)}>
      <div>{children}</div>
    </AlertStyledWrapper>
  );
};

const AlertStyledWrapper = styled.div`
  padding: 10px 15px;
  border-radius: var(--prop-border-radius);
  line-height: 20px;

  &.warning {
    background: var(--color-primary-100);
    color: var(--color-primary-500);
  }

  &.error {
    background: var(--color-coral-100);
    color: var(--color-coral-500);
  }
`;
