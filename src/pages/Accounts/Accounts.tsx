import { FC, useCallback, useMemo, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Dropdown, Icon, TableColumnProps, Text } from '@unique-nft/ui-kit';

import { Account, AccountSigner } from '@app/account';
import { useAccounts, useApi } from '@app/hooks';
import { NetworkType } from '@app/types';
import { AllBalancesResponse } from '@app/types/Api';
import {
  Button,
  Confirm,
  PagePaper,
  Table,
  TooltipWrapper,
  TransferBtn,
} from '@app/components';
import { Search } from '@app/pages/components/Search';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import { AccountContextMenu } from '@app/pages/Accounts/components';
import { useAccountsBalanceService } from '@app/api';
import { config } from '@app/config';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { ConnectWallets } from '@app/pages';

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
  .mobile-table-row {
    .accounts-table-title {
      display: none;
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

const SearchStyled = styled(Search)`
  flex: 1 1 100%;
  margin-bottom: calc(var(--prop-gap) * 1.5);

  @media screen and (min-width: 1024px) {
    flex: 1 1 auto;
    margin-bottom: 0;
  }

  @media screen and (min-width: 1280px) {
    max-width: 720px;
    margin-left: auto;
  }
`;

const ExternalLink = styled.a`
  position: relative;
  display: inline-block;
  padding-right: 18px;
  color: var(--color-primary-500);
  .icon {
    display: block;
    position: absolute;
    bottom: 0.2em;
    right: 0;
  }
`;

const LinksWrapper = styled.div`
  ${ExternalLink} {
    &:not(:last-child) {
      margin-right: calc(var(--prop-gap) / 2);
    }
  }
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

const CaptionText: FC = () => {
  const { currentChain } = useApi();

  return (
    <>
      Substrate account addresses (Kusama, Quartz, Polkadot, Unique, etc.) may
      be&nbsp;represented by&nbsp;a&nbsp;different address character sequence, but they
      can be&nbsp;converted between each other because they share the same public key.{' '}
      {currentChain.network !== 'OPAL' && (
        <>
          You can see all transformations for any given address{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            on{' '}
            <ExternalLink
              href="https://polkadot.subscan.io/tools/ss58_transform"
              rel="noreferrer"
              target="_blank"
            >
              Subscan
              <Icon size={16} name="arrow-up-right" color="currentColor" />
            </ExternalLink>
          </span>
        </>
      )}
    </>
  );
};

const TableTitle = styled.span.attrs({ className: 'accounts-table-title' })`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const AccountTitle = () => (
  <>
    Account
    <TooltipWrapper message={<CaptionText />}>
      <Icon name="question" size={20} color="var(--color-primary-500)" />
    </TooltipWrapper>
  </>
);

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
    case 'UNQ':
      return (
        <ButtonGet
          title="Get"
          role="outlined"
          onClick={() => {
            window.open(config.cryptoExchangeUNQ, '_blank', 'noopener');
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
        <ExternalLink
          target="_blank"
          rel="noreferrer"
          href={`${currentChain.subscanAddress}/account/${account?.address}`}
        >
          <Text color="primary-500">Subscan</Text>
          <Icon size={16} name="arrow-up-right" color="currentColor" />
        </ExternalLink>
      )}
      {currentChain.uniquescanAddress && (
        <ExternalLink
          target="_blank"
          rel="noreferrer"
          href={`${currentChain.uniquescanAddress}/account/${account?.address}`}
        >
          <Text color="primary-500">UniqueScan</Text>
          <Icon size={16} name="arrow-up-right" color="currentColor" />
        </ExternalLink>
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
          accountName={`${rowData?.name}`}
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

const AccountsComponent: VFC<{ className?: string }> = ({ className }) => {
  const { accounts, forgetLocalAccount, selectedAccount } = useAccounts();
  const { currentChain } = useApi();
  const [searchString, setSearchString] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [forgetWalletAddress, setForgetWalletAddress] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<Account>();
  const [isOpenConnectWallet, setOpenConnectWallet] = useState(false);

  const balances = useAccountsBalanceService(
    [...accounts].map(([_, { address }]) => address),
  );

  const accountBalances = useMemo(
    () =>
      [...accounts].map(([_, account], idx) => ({
        ...account,
        balance: balances?.[idx].data,
      })),
    [accounts, balances],
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
        account.name?.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [accountBalances, searchString]);

  const onChangeAccountsFinish = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  return (
    <>
      <PagePaper
        noPadding
        className={classNames('manage-accounts', className)}
        flexLayout="column"
      >
        <AccountsPageHeader>
          <Button
            role="primary"
            title="Connect or create wallet"
            onClick={() => setOpenConnectWallet(true)}
          />
          {/* TODO: uncomment when AccountsTotalBalance will be ready
            <AccountsTotalBalanceStyled balance={totalBalance} />
          */}
          <SearchStyled value={searchString} onChange={setSearchString} />
        </AccountsPageHeader>
        <AccountsPageContent>
          <Table
            columnPadding={32}
            columns={getAccountsColumns({
              onShowSendFundsModal: onSendFundsClick,
              onForgetWalletClick,
            })}
            data={filteredAccounts}
            loading={balances.some((balance) => balance.isLoading)}
            mobileCaption={
              <Text color="grey-500" weight="light">
                <CaptionText />
              </Text>
            }
          />
        </AccountsPageContent>
      </PagePaper>
      {isOpenModal && (
        <SendFunds
          chain={currentChain}
          isVisible={true}
          senderAccount={selectedAddress}
          networkType={selectedAccount?.unitBalance}
          onClose={onChangeAccountsFinish}
          onSendSuccess={() => {
            balances.forEach((balance) => {
              balance.refetch();
            });
          }}
        />
      )}
      {isOpenConnectWallet && (
        <ConnectWallets onClose={() => setOpenConnectWallet(false)} />
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

export const Accounts = withPageTitle({ header: 'Manage accounts' })(AccountsComponent);
