import React, { memo, VFC } from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

interface NFTsNotFoundProps {
  className?: string;
}

const NFTsNotFoundComponent: VFC<NFTsNotFoundProps> = ({ className }) => (
  <div className={classNames('not-found-container', className)}>
    <Icon name="not-found" size={80} />
    <br />
    <Text size={'l'} color={'grey-500'} weight="light">
      No items found
    </Text>
  </div>
);

const NFTsNotFoundStyled = styled(NFTsNotFoundComponent)`
  &.not-found-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const NFTsNotFound = memo(NFTsNotFoundStyled);
