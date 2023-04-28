import { ReactNode, useRef, VFC } from 'react';
import styled from 'styled-components';

import { Tooltip, TooltipAlign } from '@app/components';

interface TooltipWrapperProps {
  align?: TooltipAlign;
  children?: ReactNode | undefined;
  message: ReactNode;
  className?: string;
}

const TooltipParent = styled.span`
  display: inline-flex;
  vertical-align: middle;
`;

export const TooltipWrapper: VFC<TooltipWrapperProps> = ({
  children,
  message,
  align,
  className,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {message && (
        <Tooltip targetRef={tooltipRef} align={align} className={className}>
          {message}
        </Tooltip>
      )}
      <TooltipParent ref={tooltipRef}>{children}</TooltipParent>
    </>
  );
};
