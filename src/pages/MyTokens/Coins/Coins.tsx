import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Heading } from '@unique-nft/ui-kit';

import { NotFoundCoins } from '@app/components';

import { CoinsRow } from './components';

interface CoinsComponentProps {
  className?: string;
}

const hasCoins = true;

export const CoinsComponent: VFC<CoinsComponentProps> = ({ className }) => {
  return (
    <div className={classNames('my-tokens--coins', className)}>
      {hasCoins && (
        <>
          <Heading size="4">Network</Heading>
          <CoinsRow
            address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
            balanceFull={0.0089}
            balanceLocked={0.0089}
            balanceTransferable={0}
            iconName="chain-quartz"
            name="Quarts"
            symbol="QTZ"
          />
          <CoinsRow
            address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
            balanceFull={0.0089}
            balanceLocked={0.0089}
            balanceTransferable={0}
            iconName="chain-kusama"
            name="Kusama"
            symbol="KSM"
          />
          <CoinsRow
            address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
            balanceFull={0.0089}
            balanceLocked={0.0089}
            balanceTransferable={0}
            iconName="chain-unique"
            name="Unique network"
            symbol="UNQ"
          />
          <Heading size="4">Testnet</Heading>
          <CoinsRow
            address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
            balanceFull={0.0089}
            balanceLocked={0.0089}
            balanceTransferable={0}
            iconName="chain-opal"
            name="Opal"
            symbol="OPL"
          />
        </>
      )}
      {!hasCoins && <NotFoundCoins />}
    </div>
  );
};

export const Coins = styled(CoinsComponent)`
  .unique-font-heading.size-4 {
    margin-top: calc(var(--gap) * 2);
  }
`;
