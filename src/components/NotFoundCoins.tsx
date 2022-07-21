import { Icon } from '@unique-nft/ui-kit';
import classNames from 'classnames';
import React, { VFC } from 'react';
import styled from 'styled-components';

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
    grid-row-gap: var(--prop-gap);
    font-size: 16px;
    font-weight: 400;
    min-height: 400px;
    @media screen and (max-width: 1024px) {
      min-height: 200px;
    }
  }
`;
