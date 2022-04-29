import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Heading } from '@unique-nft/ui-kit';

import { Kusama, Opal, Quartz, Unique } from '@app/static/icons/icons';

import { CoinsRow } from './components';

interface CoinsComponentProps {
  className?: string;
}

export const CoinsComponent: VFC<CoinsComponentProps> = ({ className }) => {
  return (
    <div className={classNames('my-tokens--coins', className)}>
      <Heading size="4">Network</Heading>
      <CoinsRow
        address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
        balanceFull={0.0089}
        balanceLocked={0.0089}
        balanceTransferable={0}
        icon={Quartz}
        name="Quarts"
        symbol="QTZ"
      />
      <CoinsRow
        address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
        balanceFull={0.0089}
        balanceLocked={0.0089}
        balanceTransferable={0}
        icon={Kusama}
        name="Kusama"
        symbol="KSM"
      />
      <CoinsRow
        address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
        balanceFull={0.0089}
        balanceLocked={0.0089}
        balanceTransferable={0}
        icon={Unique}
        name="Unique network"
        symbol="UNQ"
      />
      <Heading size="4">Testnet</Heading>
      <CoinsRow
        address="5Gxot8ZtS687tSfsVmNR7NH168cMv7xznkW8hhiGDAE4Y6cj"
        balanceFull={0.0089}
        balanceLocked={0.0089}
        balanceTransferable={0}
        icon={Opal}
        name="Opal"
        symbol="OPL"
      />
    </div>
  );
};

export const Coins = styled(CoinsComponent)`
  .unique-font-heading.size-4 {
    margin-top: calc(var(--gap) * 2);
  }
`;
