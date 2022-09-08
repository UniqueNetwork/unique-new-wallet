import { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.aside`
  border-right: 1px solid var(--color-grey-300);
  padding: calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 1.5) calc(var(--prop-gap) * 2)
    calc(var(--prop-gap) * 2);
`;

export interface SidebarProps {
  children?: ReactNode;
  className?: string;
}

const Sidebar = ({ children, className }: SidebarProps) => {
  return <Wrapper className={className}>{children}</Wrapper>;
};

export default Sidebar;
