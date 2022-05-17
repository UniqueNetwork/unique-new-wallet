import React, { FC, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Button, Text, Heading } from '@unique-nft/ui-kit';

import { Table } from '../../components/Table';
import { TransferFundsModal } from '../Accounts/Modals/SendFunds';
import { PagePaper } from '../../components/PagePaper/PagePaper';
import { TableColumnProps } from '@unique-nft/ui-kit/dist/cjs/types';
import { formatKusamaBalance } from '../../utils/textUtils';
import { useAccounts } from '../../hooks/useAccounts';
import config from '../../config';
import ChainLogo from '../../components/ChainLogo';

const tokenSymbol = 'KSM';

type AccountsColumnsProps = {
  onShowSendFundsModal(): () => void
};

type ChainInfo = {
    key: string
    name: string
    address: string
}

const getAccountsColumns = ({ onShowSendFundsModal }: AccountsColumnsProps): TableColumnProps[] => ([
  {
    title: 'Network',
    width: '33%',
    field: 'chainInfo',
    render(chainInfo: ChainInfo) {
      return <ChainCellWrapper>
        <ChainLogo logo={chainInfo.key} />
        <ChainInfoWrapper>
          <Text>{chainInfo.name}</Text>
          <Text size={'s'} color={'grey-500'}>{chainInfo.address}</Text>
        </ChainInfoWrapper>
      </ChainCellWrapper>;
    }
  },
  {
    title: 'Balance',
    width: '33%',
    field: 'balance',
    render(balance: string) {
      return <BalancesWrapper>
        <Text>{`${formatKusamaBalance(balance || 0)} ${tokenSymbol}`}</Text>
      </BalancesWrapper>;
    }
  },
  {
    title: 'Actions',
    width: '33%',
    field: 'balance',
    render(balance) {
      return <ActionsWrapper>
        <Button title={'Send'} disabled={!balance} onClick={onShowSendFundsModal()} />
        <Button title={'Get'} disabled onClick={onShowSendFundsModal()} />
      </ActionsWrapper>;
    }
  }
]);

const { chains } = config;

export const CoinsPage: FC = () => {
  const { selectedAccount, fetchBalances } = useAccounts();
  const [isTransferFundsVisible, setIsTransferFundsVisible] = useState(false);

  const onSendFundsClick = useCallback(() => () => {
    setIsTransferFundsVisible(true);
  }, []);

  const onFinish = useCallback(() => {
    setIsTransferFundsVisible(false);
    fetchBalances();
  }, [fetchBalances]);

  const balances = useMemo(() => {
    return Object.keys(chains).map((chainKey: string) => ({
      chainInfo: {
        key: chainKey.toLowerCase(),
        name: chains[chainKey].name,
        address: selectedAccount?.address
      },
      balance: selectedAccount?.balance?.[tokenSymbol]?.toString()
    }));
  }, [selectedAccount, chains]);

  return (<PagePaper>
    <CoinsPageWrapper>
      <Row>
        <Heading size={'4'} >Network</Heading>
      </Row>
      <Table
        columns={getAccountsColumns({ onShowSendFundsModal: onSendFundsClick })}
        data={balances}
      />
      <TransferFundsModal isVisible={isTransferFundsVisible} onFinish={onFinish} senderAddress={selectedAccount?.address} />
    </CoinsPageWrapper>
  </PagePaper>);
};

const CoinsPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--prop-gap) * 2);
  width: 100%;
  .unique-table-data-row {
    height: fit-content;
  } 
`;

const Row = styled.div`
  display: flex;
  column-gap: var(--prop-gap);
  width: 100%;
`;

const ChainCellWrapper = styled.div`
  display: flex;
  padding: 20px 0 !important;
`;

const ChainInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BalancesWrapper = styled.div`
  padding: 0;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--prop-gap);
`;
