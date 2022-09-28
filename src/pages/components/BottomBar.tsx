import { ReactNode, useEffect, useRef, VFC } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Heading, Icon, Link, Text } from '@unique-nft/ui-kit';

import { ButtonGroup } from '@app/pages/components/FormComponents';

export interface BottomBarProps {
  buttons: ReactNode[];
  header?: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  parent: Element;
}

const Drawer = styled.div<{ bottomGap?: number }>`
  position: fixed;
  z-index: 8;
  overflow: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  background-color: var(--color-additional-light);
  padding: 80px var(--prop-gap)
    ${(p) => `calc(${p.bottomGap}px + calc(var(--prop-gap) * 2.5))`};

  @media screen and (min-width: 768px) {
    padding-left: calc(var(--prop-gap) * 1.5);
    padding-right: calc(var(--prop-gap) * 1.5);
  }
`;

const BarHeader = styled.div`
  padding: calc(var(--prop-gap) * 1.5) 0 calc(var(--prop-gap) * 2);
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
  title,
  onBackClick,
}: {
  title?: string;
  onBackClick?(): void;
}) =>
  title ? (
    <BarHeader>
      <HeadingStyled size="2">{title}</HeadingStyled>
      <BackLink href="#close" onClick={onBackClick}>
        <Icon color="var(--color-blue-grey-500)" name="arrow-left" size={16} />
        <Text color="blue-grey-500" weight="light">
          back
        </Text>
      </BackLink>
    </BarHeader>
  ) : null;

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
  const panelHeight = panelRef.current?.offsetHeight || 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return createPortal(
    <>
      {isOpen && (
        <Drawer bottomGap={panelHeight}>
          {header && header}
          {children}
        </Drawer>
      )}
      <BottomPanelWrapper height={panelHeight}>
        <BottomPanel ref={panelRef}>
          <ButtonGroup stack>{buttons}</ButtonGroup>
        </BottomPanel>
      </BottomPanelWrapper>
    </>,
    parent,
  );
};
