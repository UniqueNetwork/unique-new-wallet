import React, { FC, ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  title: string | ReactNode;
  placement?: TooltipPlacement;
}

export const Tooltip: FC<TooltipProps> = ({ title, placement = 'top', children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const onPointerEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <TooltipWrapper onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      {children}
      <TooltipBubble placement={placement} isVisible={isVisible}>
        {title}
      </TooltipBubble>
    </TooltipWrapper>
  );
};

const TooltipWrapper = styled.div`
  position: relative;
`;

const TooltipBubble = styled.div<{ placement: TooltipPlacement; isVisible: boolean }>`
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  position: absolute;
  background-color: var(--color-secondary-700);
  padding: calc(var(--gap) / 2) var(--gap);
  color: var(--color-additional-light);
  min-width: 238px;
  border-radius: 2px;
  z-index: 1000;
  top: ${({ placement }) =>
    ({ top: 'unset', bottom: '100%', left: '0px', right: '0px' }[placement])};
  bottom: ${({ placement }) =>
    ({ top: '100%', bottom: 'unset', left: 'unset', right: 'unset' }[placement])};
  left: ${({ placement }) =>
    ({ top: 'unset', bottom: 'unset', left: 'unset', right: '100%' }[placement])};
  right: ${({ placement }) =>
    ({ top: '0px', bottom: '0px', left: '100%', right: 'unset' }[placement])};
  margin-top: ${({ placement }) =>
    ({ top: 'unset', bottom: '5px', left: '0px', right: '0px' }[placement])};
  margin-bottom: ${({ placement }) =>
    ({ top: '5px', bottom: 'unset', left: 'unset', right: 'unset' }[placement])};
  margin-left: ${({ placement }) =>
    ({ top: 'unset', bottom: 'unset', left: 'unset', right: '5px' }[placement])};
  margin-right: ${({ placement }) =>
    ({ top: '0px', bottom: '0px', left: '5px', right: 'unset' }[placement])};
  &:before {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px;
    border-color: ${({ placement }) =>
      ({
        top: 'var(--color-secondary-700) transparent transparent transparent',
        bottom: 'transparent transparent var(--color-secondary-700) transparent',
        left: 'transparent transparent transparent var(--color-secondary-700)',
        right: 'transparent var(--color-secondary-700) transparent transparent',
      }[placement])};
    position: absolute;
    content: '';
    top: ${({ placement }) =>
      ({ top: '100%', bottom: '0%', left: '8px', right: '8px' }[placement])};
    left: ${({ placement }) =>
      ({ top: 'unset', bottom: 'unset', left: '100%', right: 'unset' }[placement])};
    right: ${({ placement }) =>
      ({ top: '8px', bottom: '0px', left: 'unset', right: '100%' }[placement])};
  }
`;
