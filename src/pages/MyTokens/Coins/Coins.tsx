import { AllBalancesResponse } from '@unique-nft/sdk';
import { Heading } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils/address';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';

import { ApiWrapper, useAccountBalancesService } from '@app/api';
import { config } from '@app/config';
import { useAccounts } from '@app/hooks';
import { RampModal } from '@app/pages';
import { SendFunds } from '@app/pages/SendFunds';
import { Chain, NetworkType } from '@app/types';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

import { CoinsRow } from './components';

const CoinsContainer = styled.div`
  box-sizing: border-box;
  flex: 1 1 100%;
  max-width: 100%;
  padding-top: calc(var(--prop-gap) * 2);

  @media screen and (min-width: 1024px) {
    padding: calc(var(--prop-gap) * 2);
  }
`;

const CoinsList = styled.div`
  @media screen and (min-width: 1024px) {
    display: table;
    width: 100%;
  }
`;

const CoinsHeading = styled(Heading)`
  &.size-4 {
    margin-bottom: var(--prop-gap);
  }
`;

export const Coins: FC = () => {
  const [rampModalVisible, setRampModalVisible] = useState(false);
  const [fundsModalVisible, setFundsModalVisible] = useState(false);
  const [rampModalToken, setRampModalToken] = useState('KSM');
  const [selectedNetworkType, setSelectedNetworkType] = useState<NetworkType>();
  const [selectedChain, setSelectedChain] = useState<Chain>(config.defaultChain);

  const { selectedAccount } = useAccounts();

  const accountBalances = useAccountBalancesService(
    Object.values(config.allChains).map((chain) => chain.apiEndpoint),
    selectedAccount?.address,
  ) as UseQueryResult<AllBalancesResponse>[];

  useEffect(() => {
    logUserEvent(UserEvents.COINS);
  }, []);

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

  interface NetworkInfo {
    getDisabled: boolean;
    onGet?: () => void;
    normalizedAddress: string;
  }

  const coinConfig: Record<NetworkType, NetworkInfo> = {
    OPAL: {
      getDisabled: false,
      onGet: () => {
        window.open(config.telegramBot, '_blank', 'noopener');
      },
      normalizedAddress: Address.normalize.substrateAddress(
        selectedAccount!.address,
        config.allChains.OPAL.prefix,
      ),
    },
    KUSAMA: {
      getDisabled: false,
      onGet: () => {
        getCoinsHandler();
        setRampModalToken('KSM');
      },
      normalizedAddress: selectedAccount!.address,
    },
    QUARTZ: {
      getDisabled: false,
      onGet: () => {
        window.open(config.mexcQTZUSDT, '_blank', 'noopener');
      },
      normalizedAddress: Address.normalize.substrateAddress(
        selectedAccount!.address,
        config.allChains.QUARTZ.prefix,
      ),
    },
    UNIQUE: {
      getDisabled: false,
      onGet: () => {
        window.open(config.cryptoExchangeUNQ, '_blank', 'noopener');
      },
      normalizedAddress: Address.normalize.substrateAddress(
        selectedAccount!.address,
        config.allChains.UNIQUE.prefix,
      ),
    },
    POLKADOT: {
      getDisabled: false,
      onGet: () => {
        getCoinsHandler();
        setRampModalToken('DOT');
      },
      normalizedAddress: selectedAccount!.address,
    },
  };

  return (
    <CoinsContainer>
      <CoinsHeading size="4">Network</CoinsHeading>
      <CoinsList>
        {Object.values(config.allChains).map((chain, idx) => {
          if (!coinConfig[chain.network] && selectedAccount) {
            return null;
          }

          const { getDisabled, onGet, normalizedAddress } = coinConfig[chain.network];
          return (
            <CoinsRow
              getDisabled={getDisabled}
              key={chain.network}
              loading={accountBalances[idx].isLoading}
              sendDisabled={!Number(accountBalances[idx].data?.availableBalance.amount)}
              address={normalizedAddress}
              balanceFull={accountBalances[idx].data?.freeBalance.amount}
              balanceLocked={accountBalances[idx].data?.lockedBalance.amount}
              balanceTransferable={accountBalances[idx].data?.availableBalance.amount}
              iconName={`chain-${chain.network.toLowerCase()}`}
              name={chain.name}
              symbol={accountBalances[idx].data?.availableBalance.unit || ''}
              chain={chain}
              onSend={sendFundsHandler}
              onGet={onGet}
            />
          );
        })}
      </CoinsList>

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

      <RampModal
        isVisible={rampModalVisible}
        swapAsset={rampModalToken}
        onClose={closeRampModalHandler}
      />
    </CoinsContainer>
  );
};
