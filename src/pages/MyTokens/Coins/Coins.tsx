import React, { useCallback, useState, VFC } from 'react';
import styled from 'styled-components';
import { Heading } from '@unique-nft/ui-kit';

import config from '@app/config';
import { RampModal } from '@app/pages';
import { NetworkType } from '@app/types';
import { useAccounts } from '@app/hooks';
import { useAccountBalanceService } from '@app/api';
import { SendFunds } from '@app/pages/SendFunds';

import { CoinsRow } from './components';

interface CoinsComponentProps {
  className?: string;
}

export const CoinsComponent: VFC<CoinsComponentProps> = ({ className }) => {
  const [rampModalVisible, setRampModalVisible] = useState(false);
  const [fundsModalVisible, setFundsModalVisible] = useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = useState<NetworkType>();

  const { selectedAccount } = useAccounts();

  const { isLoading: qtzLoading, data: qtzBalance } = useAccountBalanceService(
    selectedAccount?.address,
    config.quartzRestApiUrl,
  );
  const { isLoading: opalLoading, data: opalBalance } = useAccountBalanceService(
    selectedAccount?.address,
    config.uniqueRestApiUrl,
  );

  const sendFundsHandler = useCallback((networkType: NetworkType) => {
    setSelectedNetworkType(networkType);
    setFundsModalVisible(true);
  }, []);

  const getCoinsHandler = useCallback(() => setRampModalVisible(true), []);
  const closeRampModalHandler = useCallback(() => setRampModalVisible(false), []);
  const closeTransferFundsModalHandler = useCallback(
    () => setFundsModalVisible(false),
    [],
  );

  return (
    <>
      <SendFunds
        isVisible={fundsModalVisible}
        senderAccount={selectedAccount}
        networkType={selectedNetworkType}
        onClose={closeTransferFundsModalHandler}
      />
      <RampModal isVisible={rampModalVisible} onClose={closeRampModalHandler} />
      <CoinsContainer>
        <Heading size="4">Network</Heading>
        <CoinsRow
          getDisabled
          name="Quartz"
          iconName="chain-quartz"
          loading={qtzLoading}
          address={selectedAccount?.address}
          balanceFull={qtzBalance?.freeBalance.amount}
          balanceLocked={qtzBalance?.lockedBalance.amount}
          balanceTransferable={qtzBalance?.availableBalance.amount}
          sendDisabled={qtzBalance?.availableBalance.amount === '0'}
          symbol={qtzBalance?.freeBalance.unit}
          onSend={sendFundsHandler}
          onGet={getCoinsHandler}
        />
        <CoinsRow
          getDisabled
          loading={opalLoading}
          address={selectedAccount?.address}
          balanceFull={opalBalance?.freeBalance.amount}
          balanceLocked={opalBalance?.lockedBalance.amount}
          balanceTransferable={opalBalance?.availableBalance.amount}
          sendDisabled={opalBalance?.availableBalance.amount === '0'}
          iconName="chain-opal"
          name="Opal"
          symbol={opalBalance?.freeBalance.unit}
          onSend={sendFundsHandler}
          onGet={getCoinsHandler}
        />
        <CoinsRow
          sendDisabled
          address={selectedAccount?.address}
          balanceFull=""
          balanceTransferable=""
          iconName="chain-kusama"
          name="Kusama"
          symbol="KSM"
          onSend={sendFundsHandler}
          onGet={getCoinsHandler}
        />
        <CoinsRow
          getDisabled
          sendDisabled
          address={selectedAccount?.address}
          balanceFull=""
          balanceTransferable=""
          iconName="chain-unique"
          name="Unique network"
          symbol="UNQ"
          onSend={sendFundsHandler}
          onGet={getCoinsHandler}
        />
      </CoinsContainer>
    </>
  );
};

const CoinsContainer = styled.div`
  padding: 32px;
`;

export const Coins = styled(CoinsComponent)`
  .unique-font-heading.size-4 {
    margin-top: calc(var(--prop-gap) * 2);
  }
`;
