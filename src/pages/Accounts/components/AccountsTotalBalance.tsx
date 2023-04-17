import { useState, VFC } from 'react';
import styled from 'styled-components/macro';
import { BN } from '@polkadot/util';

import { Typography, Heading, Dropdown, Icon } from '@app/components';
import { formatAmount } from '@app/utils';
import { SelectOptionProps } from '@app/components/types';

interface AccountsTotalBalanceProps {
  balance: BN;
}

interface ICurrency extends SelectOptionProps {
  id: string;
  title: string;
  symbol: string;
  icon: string;
}

const currencies = [
  { id: 'USD', title: 'USD', symbol: '$', icon: 'usd-flag' },
  { id: 'CNY', title: 'CNY', symbol: '元', icon: 'cny-flag' },
  { id: 'RUB', title: 'RUB', symbol: '₽', icon: 'rub-flag' },
  { id: 'EUR', title: 'EUR', symbol: '€', icon: 'eur-flag' },
  { id: 'GBP', title: 'GBP', symbol: '£', icon: 'gbp-flag' },
  { id: 'JPY', title: 'JPY', symbol: '¥', icon: 'jpy-flag' },
];

export const AccountsTotalBalance: VFC<{
  className?: string;
  balance: AccountsTotalBalanceProps;
}> = ({ className, balance }) => {
  const [currency, setCurrency] = useState<ICurrency>(currencies[0]);

  // TODO: get converted balance to fiat currency

  return (
    <AccountsTotalBalanceWrapper className={className}>
      <Typography color="grey-500" size="s">
        Total balance (QTZ)
      </Typography>
      <AccountsTotalBalanceValue>
        <Heading size="2">{`${currency.symbol}${formatAmount(
          balance.toString(),
        )}`}</Heading>
        <Dropdown
          value={currency.id}
          iconRight={{
            size: 8,
            name: 'triangle',
          }}
          optionKey="id"
          options={currencies}
          optionRender={(option: ICurrency) => (
            <CurrencyOption title={option.title} icon={option.icon} />
          )}
          onChange={(currency: ICurrency) => setCurrency(currency)}
        >
          <CurrencyOption title={currency.title} icon={currency.icon} />
        </Dropdown>
        <ButtonReload type="button">
          <Icon size={24} name="reload" />
        </ButtonReload>
      </AccountsTotalBalanceValue>
    </AccountsTotalBalanceWrapper>
  );
};

const AccountsTotalBalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountsTotalBalanceValue = styled.div`
  display: flex;
  align-items: center;
  & > h2.unique-font-heading {
    margin-bottom: 0;
    margin-right: var(--prop-gap);
  }
`;

const CurrencyOption = ({ title, icon }: Pick<ICurrency, 'title' | 'icon'>) => (
  <CurrencyOptionWrapper>
    <Icon size={24} name={icon} />
    <Typography>{title}</Typography>
  </CurrencyOptionWrapper>
);

const CurrencyOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: calc(var(--prop-gap) / 2);
  padding-right: calc(var(--prop-gap) * 2);
  cursor: pointer;
`;

const ButtonReload = styled.button`
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  background: 0 none;
  cursor: pointer;

  .icon {
    display: block;
  }
`;
