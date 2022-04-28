import { FC } from 'react';
import styled from 'styled-components/macro';

import { useGetIcon } from '../../hooks/useGetIcon';

interface IComponentProps {
  path: string;
  color?: string;
  size?: number;
  onClick?(): void;
}

export const Icon: FC<IComponentProps> = ({
  path,
  color,
  size,
  onClick,
}: IComponentProps) => {
  const icon = useGetIcon(path);

  return (
    <IconStyled
      dangerouslySetInnerHTML={{ __html: icon }}
      size={size}
      color={color}
      onClick={onClick}
    />
  );
};

const IconStyled = styled.span<{ color?: string; size?: number }>`
  height: ${({ size }) => (size ? `${size}px` : 'unset')};
  width: ${({ size }) => (size ? `${size}px` : 'unset')};
  svg {
    height: ${({ size }) => (size ? `${size}px` : 'unset')};
    path {
      fill: ${({ color }) => color};
    }
  }
`;
