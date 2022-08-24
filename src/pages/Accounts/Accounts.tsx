import React, { createRef, useCallback, useEffect, useMemo, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  Button,
  Dropdown,
  Icon,
  InputText,
  TableColumnProps,
  Text,
  Tooltip,
} from '@unique-nft/ui-kit';

import { Account, AccountSigner } from '@app/account';
import { useAccounts, useApi } from '@app/hooks';
import { NetworkType } from '@app/types';
import { AllBalancesResponse } from '@app/types/Api';
import {
  AccountsGroupButton,
  Confirm,
  PagePaperNoPadding,
  Table,
  TransferBtn,
} from '@app/components';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import { AccountContextMenu } from '@app/pages/Accounts/components';
import { useAccountsBalanceService } from '@app/api/restApi/balance/hooks/useAccountsBalanceService';
import { config } from '@app/config';
import { usePageSettingContext } from '@app/context';

import { SendFunds } from '../SendFunds';
import { NetworkBalances } from '../components/NetworkBalances';

type AccountsColumnsProps = {
  onShowSendFundsModal(account: Account): () => void;
  onForgetWalletClick(address: string): () => void;
};

const AccountsPageHeader = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: calc(var(--prop-gap) * 2);

  @media screen and (min-width: 1024px) {
    border-bottom: 1px solid var(--color-grey-300);
    padding: calc(var(--prop-gap) * 2);

    /* TODO: uncomment when AccountsTotalBalance will be ready
      padding: calc(var(--prop-gap) * 1.3) calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 2);
    */
  }

  @media screen and (min-width: 1280px) {
    min-height: 105px;
    padding: var(--prop-gap) calc(var(--prop-gap) * 2);
  }
`;

const AccountsPageContent = styled.div`
  display: flex;
  flex: 1 1 auto;

  @media screen and (min-width: 1024px) {
    padding: calc(var(--prop-gap) * 2);
  }

  & > div {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .unique-loader {
    z-index: auto;
  }

  .unique-table-data-row {
    & > div {
      padding-top: calc(var(--prop-gap) / 2);
      padding-bottom: calc(var(--prop-gap) / 2);
    }
  }

  .mobile-table-row,
  .mobile-table-cell {
    .accounts-table-title {
      margin-bottom: var(--prop-gap);
      color: var(--color-blue-grey-600);
      font-size: 1rem;
      font-weight: 500;
    }

    &:not(:first-child) {
      .accounts-table-title {
        display: none;
      }
    }
  }
`;

/* TODO: uncomment when AccountsTotalBalance will be ready
  const AccountsTotalBalanceStyled = styled(AccountsTotalBalance)`
    flex: 1 1 100%;
    margin-bottom: calc(var(--prop-gap) * 1.5);
  
    @media screen and (min-width: 1280px) {
      flex: 0 0 auto;
      margin: 0 calc(var(--prop-gap) * 3) 0 0;
    }
  `;
*/

const SearchInputStyled = styled(InputText)`
  flex: 1 1 100%;
  margin-bottom: calc(var(--prop-gap) * 1.5);

  @media screen and (min-width: 1024px) {
    flex: 1 1 auto;
    margin-bottom: 0;
  }

  @media screen and (min-width: 1280px) {
    max-width: 500px;
    margin-left: auto;
  }
`;

const ButtonGroup = styled.div`
  flex: 1 1 100%;
  display: flex;

  @media screen and (min-width: 1024px) {
    flex: 0 0 auto;
    margin-left: calc(var(--prop-gap) * 3);
  }

  @media screen and (min-width: 1280px) {
    margin-left: calc(var(--prop-gap) * 2);
  }

  .btn-container {
    flex: 1 1 100%;
  }
`;

const LinksWrapper = styled.div``;

const LinkStyled = styled.a`
  display: inline-flex;
  align-items: center;
  column-gap: 4px;
`;

const ButtonGet = styled(Button)`
  box-sizing: border-box;
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

const TableTitle = styled.span.attrs({ className: 'accounts-table-title' })`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const AccountTitle = () => {
  const tooltipRef = createRef<HTMLDivElement>();
  return (
    <>
      Account
      <Tooltip targetRef={tooltipRef}>
        Substrate account addresses (Kusama, Quartz, Polkadot, Unique, etc.) may be
        represented by a different address character sequence, but they can be converted
        between each other because they share the same public key. You can see all
        transformations for any given address on Subscan.
      </Tooltip>
      <Icon ref={tooltipRef} name="question" size={20} color="var(--color-primary-500)" />
    </>
  );
};

const getButtonRender = (unit?: string) => {
  switch (unit) {
    case 'OPL':
      return (
        <ButtonGet
          title="Get"
          role="outlined"
          link={config.telegramBot}
          onClick={() => {
            window.open(config.telegramBot, '_blank', 'noopener');
          }}
        />
      );
    case 'QTZ':
      return (
        <ButtonGet
          title="Get"
          role="outlined"
          onClick={() => {
            window.open(config.mexcQTZUSDT, '_blank', 'noopener');
          }}
        />
      );
    default:
      return <Button disabled title="Get" />;
  }
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
    title: (
      <TableTitle>
        <AccountTitle />
      </TableTitle>
    ),
    width: '35%',
    field: 'accountInfo',
    render(address, rowData: Account) {
      return (
        <AccountCard
          canCopy
          accountAddress={`${rowData?.address}`}
          accountName={`${rowData?.meta.name}`}
          accountType={`${rowData?.signerType.toLowerCase()}`}
        />
      );
    },
  },
  {
    title: <TableTitle>Balance</TableTitle>,
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
    title: <TableTitle>Block explorer</TableTitle>,
    width: '23%',
    field: 'explorer',
    render: (_, account: Account) => <BlockExplorer account={account} />,
  },
  {
    title: <TableTitle>Actions</TableTitle>,
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
          {getButtonRender(rowData.balance?.availableBalance.unit)}
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

export const Accounts: VFC<{ className?: string }> = ({ className }) => {
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
    setPageHeading('Manage accounts');
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
    <>
      <PagePaperNoPadding
        className={classNames('data-grid', 'manage-accounts', className)}
      >
        <AccountsPageHeader>
          {/* TODO: uncomment when AccountsTotalBalance will be ready
            <AccountsTotalBalanceStyled balance={totalBalance} />
          */}
          <SearchInputStyled
            placeholder="Search"
            iconLeft={{ name: 'magnify', size: 18 }}
            value={searchString}
            onChange={setSearchString}
          />
          <ButtonGroup>
            <AccountsGroupButton />
          </ButtonGroup>
        </AccountsPageHeader>
        <AccountsPageContent>
          <Table
            columnPadding={32}
            columns={getAccountsColumns({
              onShowSendFundsModal: onSendFundsClick,
              onForgetWalletClick,
            })}
            loading={isLoadingBalances}
            data={filteredAccounts}
          />
        </AccountsPageContent>
      </PagePaperNoPadding>
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
          Are you sure you want to perform this action? You can always recover your wallet
          with your seed password using the &rsquo;Add account via&rsquo; button
        </Text>
      </Confirm>
    </>
  );
};
