import { AllBalancesResponse, ChainPropertiesResponse } from '@unique-nft/sdk';
import { Address } from '@unique-nft/utils/address';
import React, { useCallback, useEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';

import {
  ApiWrapper,
  useAccountBalancesService,
  useAccountWithdrawableBalancesService,
} from '@app/api';
import { useChainProperties } from '@app/api/restApi/properties/useChainProperties';
import { config } from '@app/config';
import { useAccounts } from '@app/hooks';
import { RampModal } from '@app/pages';
import { NoItems } from '@app/components';
import { SendFunds } from '@app/pages/SendFunds';
import { Chain, NetworkType } from '@app/types';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

import { CoinsRow } from './components';
import { Heading } from '../../../components/Heading';
import { WithdrawModal } from './modals/Withdraw';

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

export const Coins = () => {
  const [rampModalVisible, setRampModalVisible] = useState(false);
  const [fundsModalVisible, setFundsModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [rampModalToken, setRampModalToken] = useState('KSM');
  const [selectedNetworkType, setSelectedNetworkType] = useState<NetworkType>();
  const [selectedChain, setSelectedChain] = useState<Chain>(config.defaultChain);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>('0');

  const { selectedAccount, isLoading } = useAccounts();

  const accountBalances = useAccountBalancesService(
    Object.values(config.allChains).map((chain) => chain.apiEndpoint),
    selectedAccount?.address,
  ) as UseQueryResult<AllBalancesResponse>[];

  const {
    results: accountWithdrawableBalances,
    refetchAll: refetchWithdrawableBalances,
  } = useAccountWithdrawableBalancesService(
    Object.values(config.allChains).map((chain) => chain.apiEndpoint),
    selectedAccount?.address,
  );

  const chainProperty = useChainProperties(
    Object.values(config.allChains).map((chain) => ({
      network: chain.network,
      api: chain.apiEndpoint,
    })),
  );

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
  const closeTransferFundsModalHandler = useCallback(() => {
    setFundsModalVisible(false);
    setWithdrawModalVisible(false);
  }, []);

  const onWithdrawSuccess = useCallback(async () => {
    await refetchWithdrawableBalances();
  }, [refetchWithdrawableBalances]);

  const onWithdrawHandler = useCallback(
    (networkType: NetworkType, chain: Chain, amount: string) => {
      setSelectedNetworkType(networkType);
      setSelectedChain(chain);
      setAmountToWithdraw(amount);
      setWithdrawModalVisible(true);
    },
    [],
  );

  interface NetworkInfo {
    getDisabled: boolean;
    onGet?: () => void;
  }

  const coinConfig: Record<NetworkType, NetworkInfo> = {
    OPAL: {
      getDisabled: false,
      onGet: () => {
        window.open(config.telegramBot, '_blank', 'noopener');
      },
    },
    KUSAMA: {
      getDisabled: false,
      onGet: () => {
        getCoinsHandler();
        setRampModalToken('KSM');
      },
    },
    QUARTZ: {
      getDisabled: false,
      onGet: () => {
        window.open(config.mexcQTZUSDT, '_blank', 'noopener');
      },
    },
    UNIQUE: {
      getDisabled: false,
      onGet: () => {
        window.open(config.cryptoExchangeUNQ, '_blank', 'noopener');
      },
    },
    POLKADOT: {
      getDisabled: false,
      onGet: () => {
        getCoinsHandler();
        setRampModalToken('DOT');
      },
    },
  };

  if (!isLoading && !selectedAccount) {
    return <NoItems iconName="no-accounts" />;
  }

  return (
    <CoinsContainer>
      <CoinsHeading size="4">Network</CoinsHeading>
      <CoinsList>
        {Object.values(config.allChains).map((chain, idx) => {
          if (!coinConfig[chain.network] && selectedAccount) {
            return null;
          }

          const { getDisabled, onGet } = coinConfig[chain.network];
          const data = chainProperty[chain.network].data as ChainPropertiesResponse;
          const formattedAddress =
            selectedAccount &&
            (Address.is.ethereumAddress(selectedAccount.address)
              ? Address.mirror.ethereumToSubstrate(
                  selectedAccount.address,
                  data?.SS58Prefix,
                )
              : Address.normalize.substrateAddress(
                  selectedAccount.address,
                  data?.SS58Prefix,
                ));

          return (
            <CoinsRow
              getDisabled={getDisabled}
              key={chain.network}
              loading={
                chainProperty[chain.network].isLoading ||
                accountBalances[idx].isLoading ||
                accountWithdrawableBalances?.[idx].isLoading
              }
              sendDisabled={!Number(accountBalances[idx].data?.availableBalance.amount)}
              address={formattedAddress}
              balanceFull={accountBalances[idx].data?.freeBalance.amount}
              balanceLocked={accountBalances[idx].data?.lockedBalance.amount}
              balanceTransferable={accountBalances[idx].data?.availableBalance.amount}
              balanceToWithdraw={
                (accountWithdrawableBalances?.[idx].data as AllBalancesResponse)
                  ?.availableBalance
              }
              iconName={`chain-${chain.network.toLowerCase()}`}
              name={chain.name}
              symbol={accountBalances[idx].data?.availableBalance.unit || ''}
              chain={chain}
              onWithdraw={onWithdrawHandler}
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
      {withdrawModalVisible && selectedAccount && (
        <ApiWrapper>
          <WithdrawModal
            isVisible={true}
            senderAccount={selectedAccount}
            chain={selectedChain}
            amount={amountToWithdraw}
            onClose={closeTransferFundsModalHandler}
            onWithdrawSuccess={onWithdrawSuccess}
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
