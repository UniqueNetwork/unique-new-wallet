import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Icon,
  InputText,
  TableColumnProps,
  Text,
  Tooltip,
} from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { Account, AccountSigner } from '@app/account';
import { useAccounts, useApi } from '@app/hooks';
import { NetworkType } from '@app/types';
import { AllBalancesResponse } from '@app/types/Api';
import { usePageSettingContext } from '@app/context';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import { AccountContextMenu } from '@app/pages/Accounts/components/AccountContextMenu';
import {
  AccountsGroupButton,
  Confirm,
  PagePaperNoPadding,
  Table,
  TransferBtn,
} from '@app/components';
import { useAccountsBalanceService } from '@app/api/restApi/balance/hooks/useAccountsBalanceService';
import { config } from '@app/config';

import { SendFunds } from '../SendFunds';
import { NetworkBalances } from '../components/NetworkBalances';

type AccountsColumnsProps = {
  onShowSendFundsModal(account: Account): () => void;
  onForgetWalletClick(address: string): () => void;
};

const AccountTitle = () => {
  const tooltipRef = createRef<HTMLDivElement>();
  return (
    <>
      Account
      <Tooltip targetRef={tooltipRef}>
        Substrate account addresses (Kusama, Quartz, Polkadot, Unique, etc.) may
        be&nbsp;represented by&nbsp;a&nbsp;different address character sequence, but they
        can be&nbsp;converted between each other because they share the same public key.
        You can see all transformations for any given address on&nbsp;Subscan.
      </Tooltip>
      <Icon ref={tooltipRef} name="question" size={20} color="var(--color-primary-500)" />
    </>
  );
};

const BlockExplorer = ({ account }: { account: Account }) => {
  const { currentChain } = useApi();
  return (
    <LinksWrapper>
      {currentChain.subscanAddress && (
        <LinkStyled
          target="_blank"
          rel="noreferrer"
          href={`${currentChain.subscanAddress}/${account?.address}`}
        >
          <Text color="primary-500">Subscan</Text>
          <Icon size={16} name="arrow-up-right" color="var(--color-primary-500)" />
        </LinkStyled>
      )}
      {currentChain.uniquescanAddress && (
        <LinkStyled
          target="_blank"
          rel="noreferrer"
          href={`${currentChain.uniquescanAddress}/${account?.address}`}
        >
          <Text color="primary-500">UniqueScan</Text>
          <Icon size={16} name="arrow-up-right" color="var(--color-primary-500)" />
        </LinkStyled>
      )}
    </LinksWrapper>
  );
};

const getAccountsColumns = ({
  onShowSendFundsModal,
  onForgetWalletClick,
}: AccountsColumnsProps): TableColumnProps[] => [
  {
    title: <AccountTitle />,
    width: '35%',
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
    width: '23%',
    field: 'explorer',
    render: (_, account: Account) => <BlockExplorer account={account} />,
  },
  {
    title: 'Actions',
    width: '22%',
    field: 'actions',
    render(address, rowData: Account) {
      return (
        <ActionsWrapper>
          <TransferBtn
            title="Send"
            disabled={!Number(rowData.balance?.availableBalance.amount)}
            onClick={onShowSendFundsModal(rowData)}
          />
          {rowData.balance?.availableBalance.unit === 'OPL' ? (
            <Button
              title="Get"
              onClick={() => {
                window.open(config.telegramBot, '_blank', 'noopener');
              }}
            />
          ) : (
            <Button disabled title="Get" />
          )}

          {rowData.signerType === AccountSigner.local && (
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
          )}
        </ActionsWrapper>
      );
    },
  },
];

export const Accounts = () => {
  const { accounts, fetchAccounts, forgetLocalAccount, selectedAccount } = useAccounts();
  const { currentChain } = useApi();
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();
  const [searchString, setSearchString] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [forgetWalletAddress, setForgetWalletAddress] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<Account>();

  const {
    data: balancesAccounts,
    isLoading: isLoadingBalances,
    refetch,
  } = useAccountsBalanceService(accounts.map(({ address }) => address));

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
      setForgetWalletAddress(address);
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

  useEffect(() => {
    setPageBreadcrumbs({ options: [] });
    setPageHeading('My accounts');
  }, []);

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
      {isOpenModal && (
        <SendFunds
          chain={currentChain}
          isVisible={true}
          senderAccount={selectedAddress}
          networkType={selectedAccount?.unitBalance}
          onClose={onChangeAccountsFinish}
          onSendSuccess={() => {
            refetch();
          }}
        />
      )}
      <Confirm
        buttons={[
          { title: 'No, return', onClick: () => setForgetWalletAddress('') },
          {
            title: 'Yes, I am sure',
            role: 'primary',
            onClick: () => {
              forgetLocalAccount(forgetWalletAddress);
              setForgetWalletAddress('');
            },
          },
        ]}
        isVisible={Boolean(forgetWalletAddress)}
        title="Forget wallet"
        onClose={() => setForgetWalletAddress('')}
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
  padding: calc(var(--prop-gap) * 2);
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
  column-gap: 4px;
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
