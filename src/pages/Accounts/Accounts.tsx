import React, { useCallback, useMemo, useState } from 'react';
import { Dropdown, Button, InputText, TableColumnProps, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { BN } from '@polkadot/util';

import { useAccounts } from '@app/hooks';
import { formatKusamaBalance } from '@app/utils/textUtils';
import { AccountsGroupButton, Icon, PagePaperNoPadding, Table } from '@app/components';
import { Account } from '@app/account';
import { AccountsTotalBalance } from '@app/pages/Accounts/components/AccountsTotalBalance';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import { TransferFundsModal } from '@app/pages';
import { AccountContextMenu } from '@app/pages/Accounts/components/AccountContextMenu';

import ContextMenu from '../../static/icons/context-menu.svg';
import ArrowUpRight from '../../static/icons/arrow-up-right.svg';
import config from '../../config';

const tokenSymbol = 'KSM';

type AccountsColumnsProps = {
  onShowSendFundsModal(address: string): () => void;
  onForgetWalletClick(address: string): () => void;
};

const getAccountsColumns = ({
  onShowSendFundsModal,
  onForgetWalletClick,
}: AccountsColumnsProps): TableColumnProps[] => [
  {
    title: 'Account',
    width: '40%',
    field: 'address',
    render(address: string, rowData: Account) {
      return (
        <AccountCellWrapper>
          <AccountCard
            canCopy
            accountAddress={address}
            accountName={rowData.meta.name || ''}
          />
        </AccountCellWrapper>
      );
    },
  },
  {
    title: 'Balance',
    width: '20%',
    field: 'balance',
    render(balance) {
      const { KSM } = balance || {};
      return (
        <BalancesWrapper>
          <Text>{`${formatKusamaBalance(KSM || 0)} ${tokenSymbol}`}</Text>
          <Text color="grey-500" size="s">{`all transferable`}</Text>
        </BalancesWrapper>
      );
    },
  },
  {
    title: 'Block explorer',
    width: '15%',
    field: 'address',
    render(address) {
      return (
        <LinksWrapper>
          <LinkStyled
            target="_blank"
            rel="noreferrer"
            href={`${config.scanUrl}account/${address}`}
          >
            <Text color="primary-500">UniqueScan</Text>
            <Icon size={16} path={ArrowUpRight} color="none" />
          </LinkStyled>
        </LinksWrapper>
      );
    },
  },
  {
    title: 'Actions',
    width: '25%',
    field: 'actions',
    render(address) {
      return (
        <ActionsWrapper>
          <Button title="Send" onClick={onShowSendFundsModal(address)} />
          <Button disabled title="Get" />
          <Dropdown
            placement="right"
            dropdownRender={() => (
              <AccountContextMenu onForgetWalletClick={onForgetWalletClick(address)} />
            )}
          >
            <Icon path={ContextMenu} size={24} />
          </Dropdown>
        </ActionsWrapper>
      );
    },
  },
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
    [],
  );
  const onForgetWalletClick = useCallback(
    (address: string) => () => {
      // TODO: show modal to forget wallet
    },
    [],
  );

  const onSearchStringChange = useCallback((value: string) => {
    setSearchString(value);
  }, []);

  const filteredAccounts = useMemo(() => {
    if (!searchString) {
      return accounts;
    }
    return accounts?.filter(
      (account) =>
        account.address.includes(searchString) ||
        account.meta.name?.includes(searchString),
    );
  }, [accounts, searchString]);

  const onChangeAccountsFinish = useCallback(() => {
    setIsOpenModal(false);

    void fetchAccounts();
  }, [fetchAccounts]);

  const totalBalance = useMemo(
    () =>
      accounts.reduce<BN>(
        (acc, account) => (account?.balance ? acc.add(new BN(account?.balance)) : acc),
        new BN(0),
      ),
    [accounts],
  );

  return (
    <PagePaperNoPadding>
      <AccountsPageHeader>
        <AccountsTotalBalance balance={totalBalance} />
        <SearchInputWrapper>
          <SearchInputStyled
            placeholder={'Search'}
            iconLeft={{ name: 'magnify', size: 18 }}
            onChange={onSearchStringChange}
          />
        </SearchInputWrapper>
        <AccountsGroupButton />
      </AccountsPageHeader>
      <AccountsPageContent>
        <Table
          columns={getAccountsColumns({
            onShowSendFundsModal: onSendFundsClick,
            onForgetWalletClick,
          })}
          data={filteredAccounts}
        />
      </AccountsPageContent>
      <TransferFundsModal
        isVisible={isOpenModal}
        senderAddress={selectedAddress}
        onFinish={onChangeAccountsFinish}
      />
    </PagePaperNoPadding>
  );
};

const AccountsPageHeader = styled.div`
  display: flex;
  column-gap: var(--prop-gap);
  align-items: center;
  padding: var(--prop-gap) calc(var(--prop-gap) * 2);
  border-bottom: 1px solid var(--color-grey-300);
`;

const AccountsPageContent = styled.div`
  display: flex;
  column-gap: var(--prop-gap);
  margin-top: calc(var(--prop-gap) * 2);
  padding: 0 calc(var(--prop-gap) * 2);
  min-height: 679px;
  & > div {
    width: 100%;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
`;

const SearchInputStyled = styled(InputText)`
  flex-basis: 500px;
`;

const AccountCellWrapper = styled.div`
  display: flex;
  padding: 20px 0 !important;
`;

const BalancesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  column-gap: calc(var(--prop-gap) / 2);
  padding: 0 !important;
`;

const LinksWrapper = styled.div`
  padding: 0 !important;
`;

const LinkStyled = styled.a`
  display: flex;
  align-items: center;
  column-gap: calc(var(--prop-gap) / 2);
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--prop-gap);
  padding: 0 !important;
  & > div.unique-dropdown {
    padding: 0;
    cursor: pointer;
    & > div.dropdown-wrapper {
      padding: 0;
    }
  }
`;
