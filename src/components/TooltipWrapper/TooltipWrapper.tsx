import { ReactNode, useRef, VFC } from 'react';
import styled from 'styled-components';
import { Tooltip, TooltipAlign } from '@unique-nft/ui-kit';

interface TooltipWrapperProps {
  align?: TooltipAlign;
  children?: ReactNode | undefined;
  message: ReactNode;
}

const TooltipParent = styled.span`
  display: inline-flex;
  vertical-align: middle;
`;

export const TooltipWrapper: VFC<TooltipWrapperProps> = ({
  children,
  message,
  align,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Tooltip targetRef={tooltipRef} align={align}>
        {message}
      </Tooltip>
      <TooltipParent ref={tooltipRef}>{children}</TooltipParent>
    </>
  );
};
