import { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { NotFound } from '@app/static/icons/icons';

interface NotFoundCoinsProps {
  className?: string;
}

// todo - replace icon from ui kit
const NotFoundCoinsComponent: VFC<NotFoundCoinsProps> = ({ className }) => (
  <div className={classNames('nothing-found', className)}>
    <img alt="nothing-found-icon" src={NotFound} />
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
