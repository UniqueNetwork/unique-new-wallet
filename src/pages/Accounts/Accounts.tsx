import { FC, useCallback, useContext, useEffect, useMemo, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { Account, AccountSigner } from '@app/account';
import { useAccounts, useApi } from '@app/hooks';
import { NetworkType } from '@app/types';
import { AllBalancesResponse } from '@app/types/Api';
import {
  Confirm,
  PagePaper,
  Table,
  TooltipWrapper,
  TransferBtn,
  Icon,
  Typography,
  TableColumnProps,
} from '@app/components';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import { useAccountsBalanceService } from '@app/api';
import { config } from '@app/config';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { useAccountsWithdrawableBalanceService } from '@app/api/restApi/balance/useAccountsWithdrawableBalanceService';
import { sleep } from '@app/utils';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { ConnectWalletModalContext } from '@app/context';

import { Button } from '../../components/Button';
import { SendFunds } from '../SendFunds';
import { NetworkBalances } from '../components/NetworkBalances';
import { WithdrawModal } from '../MyTokens/Coins/modals/Withdraw';
import trash from '../../static/icons/trash.svg';

type AccountsColumnsProps = {
  onShowSendFundsModal(account: Account): () => void;
  onForgetWalletClick(address: string): () => void;
  onWithdrawBalance(account: Account, balanceToWithdraw: string): () => void;
};

const AccountsPageHeader = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: calc(var(--prop-gap) * 2);
  column-gap: calc(var(--prop-gap) * 2);
  row-gap: calc(var(--prop-gap) * 1.5);
  justify-content: flex-end;

  @media screen and (max-width: 568px) {
    & > button {
      width: 100%;
    }
  }
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
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: var(--prop-gap);
  div:last-child {
    min-width: 24px;
  }
  .unique-dropdown {
    .dropdown-wrapper,
    .dropdown-options {
      overflow: hidden;
      padding: 0;
      cursor: pointer;
    }
  }
  button.unique-button.ghost {
    padding: 8px 0;
  }
`;

const TransferBtnGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-gap: var(--prop-gap);
  width: -webkit-fill-available;
`;

const SendGetWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--prop-gap);
  flex-wrap: nowrap;
  button,
  a {
    flex: 1;
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
          <Typography color="primary-500">Subscan</Typography>
          <Icon size={16} name="arrow-up-right" color="currentColor" />
        </ExternalLink>
      )}
      {currentChain.uniquescanAddress && (
        <ExternalLink
          target="_blank"
          rel="noreferrer"
          href={`${currentChain.uniquescanAddress}/account/${account?.address}`}
        >
          <Typography color="primary-500">UniqueScan</Typography>
          <Icon size={16} name="arrow-up-right" color="currentColor" />
        </ExternalLink>
      )}
    </LinksWrapper>
  );
};

const getAccountsColumns = ({
  onShowSendFundsModal,
  onForgetWalletClick,
  onWithdrawBalance,
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
    width: '17%',
    field: 'explorer',
    render: (_, account: Account) => <BlockExplorer account={account} />,
  },
  {
    title: <TableTitle>Actions</TableTitle>,
    width: '28%',
    field: 'actions',
    render(address, rowData: Account) {
      return (
        <ActionsWrapper>
          <TransferBtnGroup>
            <SendGetWrapper>
              <TransferBtn
                title="Send"
                disabled={!Number(rowData.balance?.availableBalance.amount)}
                onClick={onShowSendFundsModal(rowData)}
              />
              {getButtonRender(rowData.balance?.availableBalance.unit)}
            </SendGetWrapper>
            {rowData.withdrawBalance?.availableBalance?.raw &&
              rowData.withdrawBalance?.availableBalance?.raw !== '0' && (
                <TransferBtn
                  title={`Withdraw ${rowData.withdrawBalance?.availableBalance.amount} ${rowData.withdrawBalance?.availableBalance.unit}`}
                  onClick={onWithdrawBalance(
                    rowData,
                    rowData.withdrawBalance?.availableBalance.raw || '',
                  )}
                />
              )}
          </TransferBtnGroup>
          <div>
            {rowData.signerType === AccountSigner.local && (
              <Button
                title=""
                role="ghost"
                iconLeft={{ file: trash, size: 24 }}
                onClick={onForgetWalletClick(rowData?.address)}
              />
            )}
          </div>
        </ActionsWrapper>
      );
    },
  },
];

const AccountsComponent: VFC<{ className?: string }> = ({ className }) => {
  const { setIsOpenConnectWalletModal, isOpenConnectWalletModal } = useContext(
    ConnectWalletModalContext,
  );
  const navigate = useNavigate();
  const { accounts, forgetLocalAccount, selectedAccount } = useAccounts();
  const { currentChain } = useApi();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [forgetWalletAddress, setForgetWalletAddress] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<Account>();
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>('0');

  const balances = useAccountsBalanceService(
    [...accounts].map(([_, { address }]) => address),
  );

  const withdrawableBalances = useAccountsWithdrawableBalanceService(
    [...accounts].map(([_, { address }]) => address),
  );

  const accountBalances = useMemo(
    () =>
      [...accounts].map(([_, account], idx) => ({
        ...account,
        balance: balances?.[idx].data,
        withdrawBalance: withdrawableBalances?.[idx].data,
      })),
    [accounts, balances, withdrawableBalances],
  );

  useEffect(() => {
    if (!accounts.size) {
      navigate(`/${currentChain.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
    }
  }, [accounts.size]);

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

  const onChangeAccountsFinish = useCallback(() => {
    setIsOpenModal(false);
    setWithdrawModalVisible(false);
  }, []);

  const onWithdrawBalance = useCallback(
    (account: Account, balance: string) => () => {
      setSelectedAddress(account);
      setAmountToWithdraw(balance);
      setWithdrawModalVisible(true);
    },
    [],
  );

  const onWithdrawSuccess = useCallback(async () => {
    await Promise.all(
      withdrawableBalances.map(({ refetch }) => refetch({ fetching: true })),
    );
    await sleep(2000);
  }, [selectedAddress, withdrawableBalances]);

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
            onClick={() => setIsOpenConnectWalletModal(true)}
          />
        </AccountsPageHeader>
        <AccountsPageContent>
          <Table
            columnPadding={32}
            columns={getAccountsColumns({
              onShowSendFundsModal: onSendFundsClick,
              onForgetWalletClick,
              onWithdrawBalance,
            })}
            data={accountBalances}
            loading={balances.some((balance) => balance.isLoading)}
            mobileCaption={
              <Typography color="grey-500" weight="light">
                <CaptionText />
              </Typography>
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
      {withdrawModalVisible && selectedAddress && (
        <WithdrawModal
          isVisible={true}
          senderAccount={selectedAddress}
          chain={currentChain}
          amount={amountToWithdraw}
          onClose={onChangeAccountsFinish}
          onWithdrawSuccess={onWithdrawSuccess}
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
        <Typography>
          Are you sure you want to perform this action? You can always recover your wallet
          with your seed password using the &rsquo;Connect or create wallet&rsquo; button
        </Typography>
      </Confirm>
    </>
  );
};

export const Accounts = withPageTitle({ header: 'Manage accounts' })(AccountsComponent);
