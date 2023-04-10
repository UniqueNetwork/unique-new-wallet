import React, { memo, VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { BalanceResponse } from '@unique-nft/sdk';

import { Chain } from '@app/types';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { Button, TransferBtn, Loader } from '@app/components';
import { NetworkBalances, TNetworkBalances } from '@app/pages/components/NetworkBalances';
import AccountCard from '@app/pages/Accounts/components/AccountCard';
import { DeviceSize, useDeviceSize } from '@app/hooks';
import { shortAddress } from '@app/utils';

type CoinsRowComponentProps = TNetworkBalances & {
  balanceToWithdraw?: BalanceResponse;
  address?: string;
  loading?: boolean;
  className?: string;
  iconName: string;
  name: string;
  sendDisabled?: boolean;
  getDisabled?: boolean;
  onSend: (network: string, chain: Chain) => void;
  onWithdraw: (network: string, chain: Chain, amount: string) => void;
  onGet?: () => void;
  chain: Chain;
};

const Wrapper = styled.div`
  margin-bottom: var(--prop-gap);

  @media screen and (min-width: 1024px) {
    border: 0;
    display: table-row;
    margin-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px dashed var(--color-grey-300);
  }
`;

const Column = styled.div<{ width: string; align?: 'left' | 'right' | 'center' }>`
  box-sizing: border-box;
  padding-bottom: var(--prop-gap);

  @media screen and (min-width: 1024px) {
    border-bottom: 1px dashed var(--color-grey-300);
    display: table-cell;
    vertical-align: middle;
    width: ${(p) => p.width};
    padding: var(--prop-gap);
    text-align: ${(p) => p.align};
  }

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: calc(var(--prop-gap) / 2);
  flex-wrap: wrap;
  .unique-button {
    flex: 1 1 auto;

    @media screen and (min-width: 568px) {
      flex-grow: 0;
    }
  }
`;

const SendGetWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--prop-gap);
`;

export const CoinsRowComponent: VFC<CoinsRowComponentProps> = (props) => {
  const {
    address = '',
    balanceFull = '',
    balanceLocked = '',
    balanceTransferable = '',
    balanceToWithdraw,
    loading,
    className,
    iconName,
    name,
    symbol,
    sendDisabled,
    getDisabled,
    onSend,
    onGet,
    onWithdraw,
    chain,
  } = props;

  const deviceSize = useDeviceSize();

  return (
    <Wrapper className={classNames('coins-row', className)}>
      <Column width="50%">
        <AccountCard
          accountAddress={deviceSize === DeviceSize.xs ? shortAddress(address) : address}
          accountName={name}
          canCopy={true}
          chainLogo={iconName}
        />
      </Column>
      <Column width="20%">
        {loading ? (
          <Loader />
        ) : (
          <NetworkBalances
            balanceFull={balanceFull}
            balanceTransferable={balanceTransferable}
            balanceLocked={balanceLocked}
            symbol={symbol}
          />
        )}
      </Column>
      <Column align="right" width="30%">
        <ButtonGroup>
          <SendGetWrapper>
            <TransferBtn
              disabled={sendDisabled}
              title="Send"
              onClick={() => {
                logUserEvent(`${UserEvents.SEND_COINS}_${symbol}`);
                onSend(symbol, chain);
              }}
            />
            <Button
              disabled={getDisabled}
              title="Get"
              onClick={() => {
                logUserEvent(`${UserEvents.GET_COINS}_${symbol}`);
                onGet?.();
              }}
            />
          </SendGetWrapper>
          {!!Number(balanceToWithdraw?.raw) && (
            <TransferBtn
              title={`Withdraw ${balanceToWithdraw?.formatted || ''} ${symbol}`}
              onClick={() => {
                logUserEvent(`${UserEvents.WITHDRAW_COINS}_${symbol}`);
                onWithdraw(symbol, chain, balanceToWithdraw?.raw || '0');
              }}
            />
          )}
        </ButtonGroup>
      </Column>
    </Wrapper>
  );
};

export const CoinsRow = memo(CoinsRowComponent);
