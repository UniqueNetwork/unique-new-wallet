import React, { useCallback, useState, VFC } from 'react';
import styled from 'styled-components';
import { Heading } from '@unique-nft/ui-kit';

import config from '@app/config';
import { NetworkType } from '@app/types';
import { useAccounts } from '@app/hooks';
import { RampModal, SendFundsModal } from '@app/pages';
import { useAccountBalanceService } from '@app/api';

import { CoinsRow } from './components';

interface CoinsComponentProps {
  className?: string;
}

const CoinsContainer = styled.div`
  padding: 32px;
`;

export const CoinsComponent: VFC<CoinsComponentProps> = ({ className }) => {
  const [rampModalVisible, setRampModalVisible] = useState(false);
  const [fundsModalVisible, setFundsModalVisible] = useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = useState<NetworkType>();

  const { selectedAccount } = useAccounts();

  // todo: repair balance after changing models
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
      <SendFundsModal
        isVisible={fundsModalVisible}
        networkType={selectedNetworkType}
        onClose={closeTransferFundsModalHandler}
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
          sendDisabled
          address={selectedAccount?.address}
          balanceFull="0 KSM"
          balanceTransferable="0 KSM"
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
          balanceFull="0 UNQ"
          balanceTransferable="0 UNQ"
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

export const Coins = styled(CoinsComponent)`
  .unique-font-heading.size-4 {
    margin-top: calc(var(--prop-gap) * 2);
  }
`;
