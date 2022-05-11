import { FC } from 'react';
import styled from 'styled-components/macro';

export interface IAvatarProps {
  src: string;
  size: number;
  type?: 'circle' | 'square';
}

export const Avatar: FC<IAvatarProps> = ({
  size = 38,
  src,
  type = 'square',
}: IAvatarProps) => <AvatarStyled $type={type} src={src} width={size} />;

const AvatarStyled = styled.img<{ $type: 'circle' | 'square' }>`
  border-radius: ${(props) => (props.$type === 'circle' ? '50%' : '4px')};
  outline: ${(props) =>
    props.$type === 'circle' ? '1px solid var(--color-grey-200)' : 'none'};
`;
