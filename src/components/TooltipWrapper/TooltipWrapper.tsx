import { createRef, ReactNode, VFC } from 'react';
import { Tooltip, TooltipAlign } from '@unique-nft/ui-kit';

interface TooltipWrapperProps {
  align?: TooltipAlign;
  children?: ReactNode | undefined;
  message: ReactNode | string;
}

const tooltipRef = createRef<HTMLDivElement>();

export const TooltipButtonWrapper: VFC<TooltipWrapperProps> = ({ children, message }) => {
  return (
    <>
      <Tooltip targetRef={tooltipRef}>{message}</Tooltip>
      <span ref={tooltipRef}>{children}</span>
    </>
  );
};
