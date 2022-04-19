import React, { useCallback, useMemo, useState } from 'react';
import { Button, Text, InputText, Avatar } from '@unique-nft/ui-kit';
import { TableColumnProps } from '@unique-nft/ui-kit/dist/cjs/types';
import styled from 'styled-components/macro';

import { useAccounts } from '@app/hooks';
import DefaultAvatar from '../../static/icons/default-avatar.svg';
import ArrowUpRight from '../../static/icons/arrow-up-right.svg';
import config from '../../config';
import { TransferFundsModal } from './Modals/SendFunds';
import { formatKusamaBalance } from '@app/utils/textUtils';
import { AccountsGroupButton, Icon, PagePaper, Table } from '@app/components';

const tokenSymbol = 'KSM';

type AccountsColumnsProps = {
  onShowSendFundsModal(address: string): () => void;
};

const getAccountsColumns = ({
  onShowSendFundsModal
}: AccountsColumnsProps): TableColumnProps[] => [
  {
    title: 'Account',
    width: '33%',
    field: 'accountInfo',
    render(accountInfo) {
      return (
        <AccountCellWrapper>
          <Avatar size={24} src={DefaultAvatar} />
          <AccountInfoWrapper>
            <Text>{accountInfo.name}</Text>
            <Text size={'s'} color={'grey-500'}>
              {accountInfo.address}
            </Text>
          </AccountInfoWrapper>
        </AccountCellWrapper>
      );
    }
  },
  {
    title: 'Balance',
    width: '33%',
    field: 'balance',
    render(balance) {
      const { KSM } = balance || {};
      return (
        <BalancesWrapper>
          <Text>{`${formatKusamaBalance(KSM || 0)} ${tokenSymbol}`}</Text>
        </BalancesWrapper>
      );
    }
  },
  {
    title: 'Block explorer',
    width: '33%',
    field: 'address',
    render(address) {
      return (
        <LinksWrapper>
          <LinkStyled
            target={'_blank'}
            rel={'noreferrer'}
            href={`${config.scanUrl}account/${address}`}
          >
            <Text color={'primary-500'}>UniqueScan</Text>
            <Icon size={16} path={ArrowUpRight} color={'none'} />
          </LinkStyled>
        </LinksWrapper>
      );
    }
  },
  {
    title: 'Actions',
    width: '33%',
    field: 'actions',
    render(address) {
      return (
        <ActionsWrapper>
          <Button title={'Send'} onClick={onShowSendFundsModal(address)} />
        </ActionsWrapper>
      );
    }
  }
];

export const Accounts = () => {
  const { accounts, fetchAccounts } = useAccounts();
  const [searchString, setSearchString] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string>();

  const onSendFundsClick = useCallback(
    (address: string) => () => {
      setIsOpenModal(true);
      setSelectedAddress(address);
    },
    []
  );

  const onSearchStringChange = useCallback((value: string) => {
    setSearchString(value);
  }, []);

  const filteredAccounts = useMemo(() => {
    if (!searchString) {
      return accounts.map((item) => ({
        ...item,
        accountInfo: { address: item.address, name: item.meta.name }
      }));
    }
    return accounts
      .filter(
        (account) =>
          account.address.includes(searchString) ||
          account.meta.name?.includes(searchString)
      )
      .map((item) => ({
        ...item,
        accountInfo: { address: item.address, name: item.meta.name }
      }));
  }, [accounts, searchString]);

  const onChangeAccountsFinish = useCallback(() => {
    setIsOpenModal(false);
    fetchAccounts();
  }, []);

  return (
    <PagePaper>
      <AccountPageWrapper>
        <Row>
          <AccountsGroupButton onClick={fetchAccounts} />
          <SearchInputWrapper>
            <SearchInputStyled
              placeholder={'Account'}
              iconLeft={{ name: 'magnify', size: 18 }}
              onChange={onSearchStringChange}
            />
          </SearchInputWrapper>
        </Row>
        <Table
          columns={getAccountsColumns({
            onShowSendFundsModal: onSendFundsClick
          })}
          data={filteredAccounts}
        />
        <TransferFundsModal
          isVisible={isOpenModal}
          onFinish={onChangeAccountsFinish}
          senderAddress={selectedAddress}
        />
      </AccountPageWrapper>
    </PagePaper>
  );
};

const AccountPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--gap) * 2);
  width: 100%;
  .unique-table-data-row {
    height: fit-content;
  }
`;

const Row = styled.div`
  display: flex;
  column-gap: var(--gap);
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
`;

const SearchInputStyled = styled(InputText)`
  flex-basis: 720px;
`;

const AccountCellWrapper = styled.div`
  display: flex;
  padding: 20px 0 !important;
`;

const AccountInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BalancesWrapper = styled.div`
  padding: 0;
`;

const LinksWrapper = styled.div`
  padding: 0 !important;
`;

const LinkStyled = styled.a`
  display: flex;
  align-items: center;
  column-gap: calc(var(--gap) / 2);
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--gap);
`;
