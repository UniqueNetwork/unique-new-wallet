import { useState } from 'react';
import { Text, Heading, Dropdown, SelectOptionProps } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { BN } from '@polkadot/util';

import { formatAmount } from '@app/utils';
import { Icon } from '@app/components';

import Replace from '../../../static/icons/replace.svg';
import usd from '../../../static/icons/usd-currency.svg';
import cny from '../../../static/icons/cny-currency.svg';
import rub from '../../../static/icons/rub-currency.svg';
import eur from '../../../static/icons/eur-currency.svg';
import gbp from '../../../static/icons/gbp-currency.svg';
import jpy from '../../../static/icons/jpy-currency.svg';

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
  { id: 'USD', title: 'USD', symbol: '$', icon: usd },
  { id: 'CNY', title: 'CNY', symbol: '元', icon: cny },
  { id: 'RUB', title: 'RUB', symbol: '₽', icon: rub },
  { id: 'EUR', title: 'EUR', symbol: '€', icon: eur },
  { id: 'GBP', title: 'GBP', symbol: '£', icon: gbp },
  { id: 'JPY', title: 'JPY', symbol: '¥', icon: jpy },
];

export const AccountsTotalBalance = ({ balance }: AccountsTotalBalanceProps) => {
  const [currency, setCurrency] = useState<ICurrency>(currencies[0]);

  // TODO: get converted balance to fiat currency

  return (
    <AccountsTotalBalanceWrapper>
      <Text color="grey-500" size="s">
        Total balance (QTZ)
      </Text>
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
        <Icon size={24} path={Replace} />
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
    <Icon size={24} path={icon} />
    <Text>{title}</Text>
  </CurrencyOptionWrapper>
);

const CurrencyOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: calc(var(--prop-gap) / 2);
  padding-right: calc(var(--prop-gap) * 2);
  cursor: pointer;
`;
