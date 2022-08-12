import React, { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { Icon, IconProps, Text } from '@unique-nft/ui-kit';

interface NoItemsProps {
  iconName?: IconProps['name'];
  title?: string;
}

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Title = styled(Text).attrs({ color: 'grey-500', weight: 'light' })`
  margin-top: var(--prop-gap);
`;

const NoItemsComponent: FC<NoItemsProps> = ({
  iconName = 'no-items',
  title = 'Nothing found',
}) => {
  return (
    <Wrapper>
      <Icon name={iconName} size={80} />
      <Title>{title}</Title>
    </Wrapper>
  );
};

export const NoItems = memo(NoItemsComponent);
