import { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--prop-gap) / 2);
`;

export const Tags = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <Wrapper className={className} role="list">
    {children}
  </Wrapper>
);
