import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Heading } from '@unique-nft/ui-kit';

import { RampModal } from '@app/pages';
import { Chain, NetworkType } from '@app/types';
import { useAccounts } from '@app/hooks';
import { SendFunds } from '@app/pages/SendFunds';
import { useAccountBalancesService } from '@app/api/restApi/balance/hooks/useAccountBalancesService';
import { config } from '@app/config';
import { ApiWrapper } from '@app/api';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

import { CoinsRow } from './components';

export const CoinsComponent: FC = () => {
  const [rampModalVisible, setRampModalVisible] = useState(false);
  const [fundsModalVisible, setFundsModalVisible] = useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = useState<NetworkType>();
  const [selectedChain, setSelectedChain] = useState<Chain>(config.defaultChain);

  const { selectedAccount } = useAccounts();

  const {
    isLoading: chainsBalanceLoading,
    data: chainsBalance,
    refetch: refetchChainsBalance,
  } = useAccountBalancesService(
    Object.values(config.chains).map((chain) => chain.apiEndpoint),
    selectedAccount?.address,
  );

  useEffect(() => {
    logUserEvent(UserEvents.COINS);
  }, []);

  useEffect(() => {
    refetchChainsBalance();
  }, [refetchChainsBalance, selectedAccount?.address]);

  const sendFundsHandler = useCallback((networkType: NetworkType, chain: Chain) => {
    setSelectedNetworkType(networkType);
    setSelectedChain(chain);
    setFundsModalVisible(true);
  }, []);

  const getCoinsHandler = useCallback(() => setRampModalVisible(true), []);
  const closeRampModalHandler = useCallback(() => setRampModalVisible(false), []);
  const closeTransferFundsModalHandler = useCallback(
    () => setFundsModalVisible(false),
    [],
  );

  return (
    <CoinsContainer>
      <Heading size="4">Network</Heading>
      {Object.values(config.chains).map((chain, idx) => {
        const isKusamaChain = chain.network.toLowerCase() === 'kusama';
        return (
          <CoinsRow
            getDisabled={!isKusamaChain}
            key={chain.network}
            loading={chainsBalanceLoading}
            sendDisabled={!Number(chainsBalance?.[idx].availableBalance.amount)}
            address={selectedAccount?.address}
            balanceFull={chainsBalance?.[idx].freeBalance.amount}
            balanceLocked={chainsBalance?.[idx].lockedBalance.amount}
            balanceTransferable={chainsBalance?.[idx].availableBalance.amount}
            iconName={`chain-${chain.network.toLowerCase()}`}
            name={chain.name}
            symbol={chainsBalance?.[idx].availableBalance.unit}
            chain={chain}
            onSend={sendFundsHandler}
            onGet={isKusamaChain ? getCoinsHandler : undefined}
          />
        );
      })}
      {fundsModalVisible && (
        <ApiWrapper>
          <SendFunds
            isVisible={true}
            senderAccount={selectedAccount}
            networkType={selectedNetworkType}
            chain={selectedChain}
            onClose={closeTransferFundsModalHandler}
          />
        </ApiWrapper>
      )}
      <RampModal isVisible={rampModalVisible} onClose={closeRampModalHandler} />
    </CoinsContainer>
  );
};

const CoinsContainer = styled.div`
  flex: 1 1 100%;
  padding: calc(var(--prop-gap) * 2);
`;

export const Coins = styled(CoinsComponent)`
  .unique-font-heading.size-4 {
    margin-top: calc(var(--prop-gap) * 2);
  }
`;
