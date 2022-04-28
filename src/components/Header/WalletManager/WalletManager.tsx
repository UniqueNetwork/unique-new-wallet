import React, { FC, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';
import { Button, Text } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import { formatKusamaBalance, shortcutText } from '@app/utils/textUtils';
import { Icon } from '@app/components';
import { useApi } from '@app/hooks';

import { useAccounts } from '../../../hooks/useAccounts';
import { DropdownSelect, DropdownSelectProps } from './AccountSelect/DropdownSelect';
import Loading from '../../Loading';
import { Avatar } from '../../Avatar/Avatar';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';
import Gear from '../../../static/icons/gear.svg';
import { BalanceOption } from './types';
import useDeviceSize, { DeviceSize } from '../../../hooks/useDeviceSize';

const tokenSymbol = 'KSM';

export const WalletManager: FC = () => {
  const {
    selectedAccount,
    accounts,
    isLoading,
    isLoadingBalances,
    fetchAccounts,
    changeAccount,
  } = useAccounts();
  const { currentChain } = useApi();
  const deviceSize = useDeviceSize();

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const onOnChainChange = useCallback(() => {
    // TODO: change chain
  }, []);

  const onCreateAccountClick = useCallback(() => {
    // TODO: call creating account
  }, []);

  const currentBalance: BalanceOption = useMemo(() => {
    return {
      value: selectedAccount?.balance?.KSM?.toString() || '0',
      chain: currentChain,
    };
  }, [selectedAccount, currentChain]);

  if (!isLoading && accounts.length === 0) {
    return <Button title={'Сonnect or create account'} onClick={onCreateAccountClick} />;
  }

  return (
    <WalletManagerWrapper>
      {isLoading && <Loading />}
      <AccountSelect
        renderOption={AccountOptionCard}
        options={accounts || []}
        value={selectedAccount}
        onChange={changeAccount}
      />
      <Divider />
      <DropdownSelect<BalanceOption>
        renderOption={BalanceOptionCard}
        options={[]}
        value={currentBalance}
        onChange={onOnChainChange}
      />
      {isLoadingBalances && <Loading />}
      {deviceSize === DeviceSize.lg && (
        <>
          <Divider />
          <SettingsButtonWrapper>
            <Icon path={Gear} size={24} color={'var(--color-grey-500)'} />
          </SettingsButtonWrapper>
        </>
      )}
    </WalletManagerWrapper>
  );
};

const AccountOptionCard = (account: Account) => {
  return (
    <AccountOptionWrapper>
      <Avatar size={24} src={DefaultAvatar} />
      <AccountOptionPropertyWrapper>
        {account.meta?.name && (
          <Text size={'m'} weight={'medium'}>
            {account.meta?.name}
          </Text>
        )}
        <Text size={'s'} color={'grey-500'}>
          {shortcutText(account.address)}
        </Text>
      </AccountOptionPropertyWrapper>
    </AccountOptionWrapper>
  );
};

const BalanceOptionCard = (balance: BalanceOption) => {
  return (
    <BalanceOptionWrapper>
      <Text size={'m'} weight={'medium'}>{`${formatKusamaBalance(
        balance.value,
      )} ${tokenSymbol}`}</Text>
      <Text size={'s'} color={'grey-500'}>
        {balance.chain.name}
      </Text>
    </BalanceOptionWrapper>
  );
};

const AccountSelect = styled((props: DropdownSelectProps<Account>) =>
  DropdownSelect<Account>(props),
)`
  height: 100%;
  @media (max-width: 768px) {
    div[class^='WalletManager__AccountOptionPropertyWrapper'] {
      display: none;
    }
  }
`;

const AccountOptionWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--gap) / 2);
  cursor: pointer;
`;

const AccountOptionPropertyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BalanceOptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const SettingsButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 var(--gap);
`;

const WalletManagerWrapper = styled.div`
  border: 1px solid var(--color-blue-grey-200);
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  position: relative;
`;

const Divider = styled.div`
  width: 1px;
  margin: calc(var(--gap) / 2) 0;
  border-left: 1px solid var(--color-blue-grey-200);
`;
