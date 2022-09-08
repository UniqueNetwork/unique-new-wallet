import { ReactNode } from 'react';
import styled from 'styled-components';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { PagePaper } from '@app/components';

export interface LayoutProps {
  children?: ReactNode;
  className?: string;
  header?: ReactNode;
  sidebar?: ReactNode;
}

const Wrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Content = styled.div`
  flex: 1 1 auto;
  display: grid;

  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 4fr;
  }

  @media screen and (min-width: 1600px) {
    grid-template-columns: 1fr 5fr;
  }
`;

const Inner = styled.div`
  flex: 1 1 auto;
  display: flex;

  @media screen and (min-width: 1024px) {
    padding: calc(var(--prop-gap) * 2);
  }
`;

const Layout = ({ children, className, header, sidebar }: LayoutProps) => {
  const deviceSize = useDeviceSize();

  return (
    <Wrapper className={className}>
      {header && <PagePaper.Header>{header}</PagePaper.Header>}
      {sidebar ? (
        <Content>
          {sidebar && deviceSize >= DeviceSize.lg && (
            <PagePaper.Sidebar>{sidebar}</PagePaper.Sidebar>
          )}
          <Inner>{children}</Inner>
        </Content>
      ) : (
        <Inner>{children}</Inner>
      )}
    </Wrapper>
  );
};

export default Layout;
