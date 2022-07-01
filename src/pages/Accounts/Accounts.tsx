import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Icon,
  InputText,
  TableColumnProps,
  Text,
} from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { Account } from '@app/account';
import { useAccounts } from '@app/hooks';
import { NetworkType } from '@app/types';
import { AllBalancesResponse } from '@app/types/Api';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import { AccountContextMenu } from '@app/pages/Accounts/components/AccountContextMenu';
import { AccountsGroupButton, Confirm, PagePaperNoPadding, Table } from '@app/components';
import { useAccountsBalanceService } from '@app/api/restApi/balance/hooks/useAccountsBalanceService';

import config from '../../config';
import { SendFunds } from '../SendFunds';
import { NetworkBalances } from '../components/NetworkBalances';

type AccountsColumnsProps = {
  sendDisabled?: boolean;
  onShowSendFundsModal(account: Account): () => void;
  onForgetWalletClick(address: string): () => void;
};

const getAccountsColumns = ({
  sendDisabled,
  onShowSendFundsModal,
  onForgetWalletClick,
}: AccountsColumnsProps): TableColumnProps[] => [
  {
    title: 'Account',
    width: '40%',
    field: 'accountInfo',
    render(address, rowData: Account) {
      return (
        <AccountCellWrapper>
          <AccountCard
            canCopy
            accountAddress={rowData?.address}
            accountName={
              `${rowData?.meta.name} ${
                rowData?.signerType && `(${rowData.signerType.toLowerCase()})`
              }` || ''
            }
          />
        </AccountCellWrapper>
      );
    },
  },
  {
    title: 'Balance',
    width: '20%',
    field: 'balance',
    render(balance?: AllBalancesResponse) {
      return (
        <NetworkBalances
          balanceFull={balance?.freeBalance.amount}
          balanceTransferable={balance?.availableBalance.amount}
          balanceLocked={balance?.lockedBalance.amount}
          symbol={balance?.availableBalance.unit as NetworkType}
        />
      );
    },
  },
  {
    title: 'Block explorer',
    width: '15%',
    field: 'explorer',
    render(address, rowData: Account) {
      return (
        <LinksWrapper>
          <LinkStyled
            target="_blank"
            rel="noreferrer"
            href={`${config.scanUrl}account/${rowData?.address}`}
          >
            <Text color="primary-500">UniqueScan</Text>
            <Icon size={16} name="arrow-up-right" />
          </LinkStyled>
        </LinksWrapper>
      );
    },
  },
  {
    title: 'Actions',
    width: '25%',
    field: 'actions',
    render(address, rowData: Account) {
      return (
        <ActionsWrapper>
          <Button
            title="Send"
            disabled={!Number(rowData.balance?.availableBalance.amount)}
            onClick={onShowSendFundsModal(rowData)}
          />
          <Button disabled title="Get" />
          <Dropdown
            placement="right"
            dropdownRender={() => (
              <AccountContextMenu
                onForgetWalletClick={onForgetWalletClick(rowData?.address)}
              />
            )}
          >
            <Icon name="more-horiz" size={24} />
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
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Account>();

  const { data: balancesAccounts, isLoading: isLoadingBalances } =
    useAccountsBalanceService(accounts.map(({ address }) => address));

  const accountBalances = useMemo<Account[]>(
    () =>
      accounts.map((account, idx) => ({
        ...account,
        balance: balancesAccounts?.[idx],
      })),
    [accounts, balancesAccounts],
  );

  const onSendFundsClick = useCallback(
    (account: Account) => () => {
      setIsOpenModal(true);
      setSelectedAddress(account);
    },
    [],
  );

  const onForgetWalletClick = useCallback(
    (address: string) => () => {
      setIsOpenConfirm(true);
    },
    [],
  );

  const filteredAccounts = useMemo(() => {
    if (!searchString) {
      return accountBalances;
    }
    return accountBalances?.filter(
      (account) =>
        account.address.toLowerCase().includes(searchString.toLowerCase()) ||
        account.meta.name?.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [accountBalances, searchString]);

  const onChangeAccountsFinish = useCallback(() => {
    setIsOpenModal(false);

    void fetchAccounts();
  }, [fetchAccounts]);

  // const totalBalance = useMemo(
  //   () =>
  //     accounts.reduce<BN>(
  //       (acc, account) => (account?.balance ? acc.add(new BN(account?.balance)) : acc),
  //       new BN(0),
  //     ),
  //   [accounts],
  // );

  return (
    <PagePaperNoPadding>
      <AccountsPageHeader>
        {/* <AccountsTotalBalance balance={totalBalance} /> */}
        <SearchInputWrapper>
          <SearchInputStyled
            placeholder="Search"
            iconLeft={{ name: 'magnify', size: 18 }}
            value={searchString}
            onChange={setSearchString}
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
          loading={isLoadingBalances}
          data={filteredAccounts}
        />
      </AccountsPageContent>
      <SendFunds
        isVisible={isOpenModal}
        senderAccount={selectedAddress}
        onClose={onChangeAccountsFinish}
      />
      <Confirm
        buttons={[
          { title: 'No, return', onClick: () => setIsOpenConfirm(false) },
          {
            title: 'Yes, I am sure',
            role: 'primary',
            onClick: () => setIsOpenConfirm(false),
          },
        ]}
        isVisible={isOpenConfirm}
        title="Forget wallet"
        onClose={() => setIsOpenConfirm(false)}
      >
        <Text>
          Are you sure you want to&nbsp;perform this action? You can always recover your
          wallet with your seed password using the &rsquo;Add account via&rsquo; button
        </Text>
      </Confirm>
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
  padding: 20px 0;
`;

const LinksWrapper = styled.div``;

const LinkStyled = styled.a`
  display: flex;
  align-items: center;
  column-gap: calc(var(--prop-gap) / 2);
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--prop-gap);

  .unique-dropdown {
    .dropdown-wrapper,
    .dropdown-options {
      overflow: hidden;
      padding: 0;
      cursor: pointer;
    }
  }
`;
