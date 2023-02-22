import { memo, ReactNode } from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
  &.sm {
    &:not(:first-child) {
      margin-top: var(--prop-gap);
    }
  }

  &.md {
    &:not(:first-child) {
      margin-top: calc(var(--prop-gap) * 1.5);
    }
  }

  .unique-input-text {
    width: 100%;

    label {
      display: flex;
      align-items: center;
      gap: calc(var(--prop-gap) / 2.5);
    }
  }
`;

const TransferRowComponent = ({
  gap = 'md',
  children,
}: {
  gap?: 'sm' | 'md' | undefined;
  children?: ReactNode;
}) => <Wrapper className={gap}>{children}</Wrapper>;

export const TransferRow = memo(TransferRowComponent);
