import React, { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Icon } from '@unique-nft/ui-kit';

interface NotFoundCoinsProps {
  className?: string;
}

const NotFoundCoinsComponent: VFC<NotFoundCoinsProps> = ({ className }) => (
  <div className={classNames('nothing-found', className)}>
    <Icon name="box" size={80} />
    Nothing found
  </div>
);

export const NotFoundCoins = styled(NotFoundCoinsComponent)`
  &.nothing-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-blue-grey-500);
    min-height: 600px;
    grid-row-gap: var(--gap);
  }
`;
