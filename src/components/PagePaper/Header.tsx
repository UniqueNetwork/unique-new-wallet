import { ReactNode } from 'react';
import styled from 'styled-components';

import { DeviceSize, useDeviceSize } from '@app/hooks';

import { PagePaper } from './PagePaper';

const Wrapper = styled.div`
  flex: 0 0 auto;

  @media screen and (min-width: 1024px) {
    border-bottom: 1px solid var(--color-grey-300);
  }
`;

export interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
  const deviceSize = useDeviceSize();

  return (
    <Wrapper
      as={PagePaper.Panel}
      className={className}
      stacked={deviceSize <= DeviceSize.md ? 'both' : undefined}
    >
      {children}
    </Wrapper>
  );
};

export default Header;
