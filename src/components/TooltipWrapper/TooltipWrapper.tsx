import { ReactNode, VFC } from 'react';
import styled from 'styled-components';
import { Tooltip } from '@unique-nft/ui-kit';

interface TooltipWrapperProps {
  message: ReactNode | string;
  placement?: 'bottom' | 'top' | 'left-start' | 'right-start';
  children?: ReactNode | undefined;
}

const Wrapper = styled.span`
  & > .unique-button {
    pointer-events: none;
  }
`;

export const TooltipButtonWrapper: VFC<TooltipWrapperProps> = ({
  children,
  message,
  placement,
}) => {
  return (
    <Tooltip content={<Wrapper>{children}</Wrapper>} placement={placement}>
      {message}
    </Tooltip>
  );
};
