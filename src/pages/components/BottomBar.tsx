import { ReactNode, useEffect, useRef, useState, VFC } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Heading, Link, Text } from '@unique-nft/ui-kit';

import { ButtonGroup } from '@app/pages/components/FormComponents';
import { Icon } from '@app/components';

export interface BottomBarProps {
  buttons: ReactNode[];
  header?: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  parent: Element;
}

const Drawer = styled.div<{ bottomGap?: number }>`
  position: fixed;
  z-index: 9;
  overflow: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  margin: 0;
  background-color: var(--color-additional-light);
  padding: 80px 0 ${(p) => `${p.bottomGap}px`};
`;

const BarHeader = styled.div`
  flex: 0 0 auto;
  padding: calc(var(--prop-gap) * 1.5) var(--prop-gap) var(--prop-gap);

  @media screen and (min-width: 768px) {
    padding-left: calc(var(--prop-gap) * 1.5);
    padding-right: calc(var(--prop-gap) * 1.5);
  }
`;

const HeadingStyled = styled(Heading)`
  &[class*='size-'] {
    margin: 0;

    &:not(:last-child) {
      margin-bottom: calc(var(--prop-gap) / 2);
    }
  }
`;

const BackLink = styled(Link)`
  &:focus-visible {
    outline: -webkit-focus-ring-color auto;
  }
`;

export const BottomBarHeader = ({
  children,
  title,
  showBackLink = true,
  onBackClick,
}: {
  children?: ReactNode;
  title?: string;
  showBackLink?: boolean;
  onBackClick?(): void;
}) =>
  title ? (
    <BarHeader>
      <HeadingStyled size="2">{title}</HeadingStyled>
      {showBackLink && (
        <BackLink href="#close" onClick={onBackClick}>
          <Icon color="var(--color-blue-grey-500)" name="arrow-left" size={16} />
          <Text color="blue-grey-500" weight="light">
            back
          </Text>
        </BackLink>
      )}
      {children && children}
    </BarHeader>
  ) : null;

const DrawerContent = styled.div`
  overflow: auto;
  flex: 1 1 auto;
  padding: var(--prop-gap);

  @media screen and (min-width: 768px) {
    padding-left: calc(var(--prop-gap) * 1.5);
    padding-right: calc(var(--prop-gap) * 1.5);
  }
`;

const BottomPanelWrapper = styled.div<{ height: number }>`
  height: ${(p) => `${p.height}px`};
`;

const BottomPanel = styled.div`
  z-index: 8;
  box-shadow: 0 -8px 12px rgba(0, 0, 0, 0.06);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: calc(var(--prop-gap) / 1.6) var(--prop-gap);
  background-color: var(--color-additional-light);

  @media screen and (min-width: 568px) {
    padding-left: calc(var(--prop-gap) * 1.5);
    padding-right: calc(var(--prop-gap) * 1.5);
  }
`;

export const BottomBar: VFC<BottomBarProps> = ({
  buttons,
  header,
  children,
  isOpen,
  parent,
}: BottomBarProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    setPanelHeight(panelRef.current?.offsetHeight || 0);

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, panelRef.current?.offsetHeight]);

  return createPortal(
    <>
      {isOpen && (
        <Drawer bottomGap={panelHeight}>
          {header && header}
          <DrawerContent>{children}</DrawerContent>
        </Drawer>
      )}
      <BottomPanelWrapper height={panelHeight}>
        <BottomPanel ref={panelRef}>
          <ButtonGroup $fill gap={8}>
            {buttons}
          </ButtonGroup>
        </BottomPanel>
      </BottomPanelWrapper>
    </>,
    parent,
  );
};
