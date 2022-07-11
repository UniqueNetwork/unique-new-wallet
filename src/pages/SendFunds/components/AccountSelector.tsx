import { FC } from 'react';
import { Dropdown, Text } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import {
  AccountSelect,
  AccountSelectWrapper,
} from '@app/pages/SendFunds/components/Style';
import { AccountInfo } from '@app/pages/SendFunds/components/AccountInfo';
import { AllBalancesResponse } from '@app/types/Api';

export const AccountSelector: FC<{
  canCopy?: boolean;
  selectOptions: any[];
  selectedValue?: Account;
  onChangeAccount?(value: Account): void;
  balance?: AllBalancesResponse;
}> = ({ canCopy = true, selectedValue, selectOptions, onChangeAccount, balance }) => {
  return (
    <>
      <AccountSelect>
        <Dropdown
          value={selectedValue?.address}
          options={selectOptions || []}
          optionKey="address"
          optionRender={(option: any) => (
            <AccountInfo
              address={option.address}
              key={option.address}
              name={option.meta.name}
            />
          )}
          onChange={onChangeAccount as any}
        >
          <AccountSelectWrapper>
            <AccountInfo
              address={selectedValue?.address}
              name={selectedValue?.meta.name}
              canCopy={canCopy}
            />
          </AccountSelectWrapper>
        </Dropdown>
      </AccountSelect>
      <Text size="s">
        {balance?.availableBalance.amount} {balance?.availableBalance.unit}
      </Text>
    </>
  );
};
