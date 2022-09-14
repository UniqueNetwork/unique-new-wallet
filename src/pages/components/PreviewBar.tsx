import { ReactNode, useEffect, useRef, VFC } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { ButtonGroup } from '@app/pages/components/FormComponents';

const PreviewDrawer = styled.div`
  position: fixed;
  z-index: 8;
  overflow: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  background-color: var(--color-additional-light);
  padding: 80px var(--prop-gap) 60px;

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

interface PreviewBarProps {
  buttons: ReactNode[];
  children: ReactNode;
  isOpen: boolean;
  parent: Element;
}

export const PreviewBar: VFC<PreviewBarProps> = ({
  buttons,
  children,
  isOpen,
  parent,
}: PreviewBarProps) => {
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
      {isOpen && <PreviewDrawer>{children}</PreviewDrawer>}
      <BottomPanelWrapper height={panelHeight}>
        <BottomPanel ref={panelRef}>
          <ButtonGroup>{buttons}</ButtonGroup>
        </BottomPanel>
      </BottomPanelWrapper>
    </>,
    parent,
  );
};
