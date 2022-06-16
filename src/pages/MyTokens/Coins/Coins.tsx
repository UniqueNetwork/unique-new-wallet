import React, { useContext, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Heading } from '@unique-nft/ui-kit';

import { NotFoundCoins } from '@app/components';
import AccountContext from '@app/account/AccountContext';
import { useAccountBalanceService } from '@app/api';
import config from '@app/config';

import { CoinsRow } from './components';

interface CoinsComponentProps {
  className?: string;
}

const CoinsContainer = styled.div`
  padding: 32px;
`;

export const CoinsComponent: VFC<CoinsComponentProps> = ({ className }) => {
  const { selectedAccount } = useContext(AccountContext);

  const { isLoading: qtzLoading, data: qtzBalance } = useAccountBalanceService(
    selectedAccount?.address,
    config.quartzRestApiUrl,
  );
  const { isLoading: opalLoading, data: opalBalance } = useAccountBalanceService(
    selectedAccount?.address,
    config.uniqueRestApiUrl,
  );

  return (
    <CoinsContainer>
      <Heading size="4">Network</Heading>
      <CoinsRow
        loading={qtzLoading}
        address={selectedAccount?.address}
        balanceFull={qtzBalance?.formatted}
        balanceTransferable={qtzBalance?.amountWithUnit}
        iconName="chain-quartz"
        name="Quartz"
        symbol="QTZ"
      />
      <CoinsRow
        loading={opalLoading}
        address={selectedAccount?.address}
        balanceFull={opalBalance?.formatted}
        balanceTransferable={opalBalance?.amountWithUnit}
        iconName="chain-opal"
        name="Opal"
        symbol="OPL"
      />
      <CoinsRow
        address={selectedAccount?.address}
        balanceFull="0 KSM"
        balanceTransferable="0 KSM"
        iconName="chain-kusama"
        name="Kusama"
        symbol="KSM"
      />
      <CoinsRow
        address={selectedAccount?.address}
        balanceFull="0 UNQ"
        balanceTransferable="0 UNQ"
        iconName="chain-unique"
        name="Unique network"
        symbol="UNQ"
      />
    </CoinsContainer>
  );
};

export const Coins = styled(CoinsComponent)`
  .unique-font-heading.size-4 {
    margin-top: calc(var(--prop-gap) * 2);
  }
`;
