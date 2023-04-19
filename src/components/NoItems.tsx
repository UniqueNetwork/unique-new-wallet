import React, { FC, memo } from 'react';
import styled from 'styled-components/macro';

import { Icon, IconProps } from '../components';
import { Typography } from './Typography/Typography';
interface NoItemsProps {
  className?: string;
  file?: string;
  iconName?: IconProps['name'];
  iconSize?: number;
  title?: string;
}

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  user-select: none;
`;

const Title = styled(Typography).attrs({ color: 'grey-500', weight: 'light' })`
  margin-top: var(--prop-gap);
`;

const NoItemsComponent: FC<NoItemsProps> = ({
  className,
  file,
  iconName = 'no-items',
  iconSize = 80,
  title = 'Nothing found',
}) => {
  return (
    <Wrapper className={className}>
      {file ? <img src={file} alt={title} /> : <Icon name={iconName} size={iconSize} />}
      <Title>{title}</Title>
    </Wrapper>
  );
};

export const NoItems = memo(NoItemsComponent);
