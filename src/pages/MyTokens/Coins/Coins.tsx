import React, { useCallback, useContext, useState, VFC } from 'react';
import styled from 'styled-components';
import { Heading } from '@unique-nft/ui-kit';

import config from '@app/config';
import { NetworkType } from '@app/types';
import { RampModal, TransferFundsModal } from '@app/pages';
import { useAccountBalanceService } from '@app/api';
import AccountContext from '@app/account/AccountContext';

import { CoinsRow } from './components';

interface CoinsComponentProps {
  className?: string;
}

const CoinsContainer = styled.div`
  padding: 32px;
`;

export const CoinsComponent: VFC<CoinsComponentProps> = ({ className }) => {
  const { selectedAccount } = useContext(AccountContext);
  const [rampModalVisible, setRampModalVisible] = useState(false);
  const [fundsModalVisibility, setFundsModalVisibility] = useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = useState<NetworkType>();

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
    setFundsModalVisibility(true);
  }, []);

  const getCoinsHandler = useCallback(() => setRampModalVisible(true), []);
  const closeRampModalHandler = useCallback(() => setRampModalVisible(false), []);

  return (
    <>
      <TransferFundsModal
        networkType={selectedNetworkType}
        isVisible={fundsModalVisibility}
        onFinish={() => {
          setFundsModalVisibility(false);
        }}
      />
      <RampModal isVisible={rampModalVisible} onClose={closeRampModalHandler} />
      <CoinsContainer>
        <Heading size="4">Network</Heading>
        <CoinsRow
          getDisabled
          loading={qtzLoading}
          address={selectedAccount?.address}
          balanceFull={qtzBalance?.formatted}
          balanceTransferable={qtzBalance?.amountWithUnit}
          iconName="chain-quartz"
          name="Quartz"
          symbol="QTZ"
          onSend={sendFundsHandler}
          onGet={getCoinsHandler}
        />
        <CoinsRow
          getDisabled
          loading={opalLoading}
          address={selectedAccount?.address}
          balanceFull={opalBalance?.formatted}
          balanceTransferable={opalBalance?.amountWithUnit}
          iconName="chain-opal"
          name="Opal"
          symbol="OPL"
          onSend={sendFundsHandler}
          onGet={getCoinsHandler}
        />
        <CoinsRow
          address={selectedAccount?.address}
          balanceFull="0 KSM"
          balanceTransferable="0 KSM"
          iconName="chain-kusama"
          name="Kusama"
          symbol="KSM"
          onSend={() => {}}
          onGet={getCoinsHandler}
        />
        <CoinsRow
          getDisabled
          address={selectedAccount?.address}
          balanceFull="0 UNQ"
          balanceTransferable="0 UNQ"
          iconName="chain-unique"
          name="Unique network"
          symbol="UNQ"
          onSend={() => {}}
          onGet={getCoinsHandler}
        />
      </CoinsContainer>
    </>
  );
};

export const Coins = styled(CoinsComponent)`
  .unique-font-heading.size-4 {
    margin-top: calc(var(--prop-gap) * 2);
  }
`;
