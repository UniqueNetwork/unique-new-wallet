import { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import Header, { HeaderProps } from './Header';
import Sidebar, { SidebarProps } from './Sidebar';
import Layout, { LayoutProps } from './Layout';
import Panel, { PanelProps } from './Panel';

interface PagePaperProps {
  children?: ReactNode;
  className?: string;
  flexLayout?: 'row' | 'column' | undefined;
  noPadding?: boolean;
}

interface PagePaperComposition {
  Header: FC<HeaderProps>;
  Sidebar: FC<SidebarProps>;
  Layout: FC<LayoutProps>;
  Panel: FC<PanelProps>;
}

export const PagePaperStyles = css`
  flex: 1 1 auto;

  @media screen and (min-width: 1024px) {
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    border-radius: var(--prop-border-radius);
    background: var(--color-additional-light);
  }
`;

const Wrapper = styled.div<Pick<PagePaperProps, 'flexLayout' | 'noPadding'>>`
  ${PagePaperStyles};
  flex: 1 1 auto;
  display: ${(p) => (p.flexLayout ? 'flex' : undefined)};
  flex-direction: ${(p) => p.flexLayout};
  padding: ${(p) => (p.noPadding ? undefined : 'calc(var(--prop-gap) * 2)')};
`;

export const PagePaper: FC<PagePaperProps> & PagePaperComposition = ({
  children,
  className,
  flexLayout,
  noPadding,
}: PagePaperProps) => (
  <Wrapper className={className} flexLayout={flexLayout} noPadding={noPadding}>
    {children}
  </Wrapper>
);

PagePaper.Header = Header;
PagePaper.Sidebar = Sidebar;
PagePaper.Layout = Layout;
PagePaper.Panel = Panel;
