// @ts-nocheck
import React, { useCallback, useRef, useState } from 'react';
import {
  ClearIndicatorProps,
  components,
  DropdownIndicatorProps,
  GroupBase,
  OptionProps,
  SelectInstance,
  SingleValueProps,
} from 'react-select';
import CreatebleSelect, { CreatableProps } from 'react-select/creatable';

import { Account } from '@app/account';
import { Icon } from '@app/components';
import AccountCard from '@app/pages/Accounts/components/AccountCard';

import { theme } from '../theme';
import { styles } from './styles';

const DropdownIndicator = (props: DropdownIndicatorProps<Account, false>) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon size={8} color="var(--color-blue-grey-400)" name="triangle" />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: ClearIndicatorProps<Account, false>) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon size={19} color="var(--color-blue-grey-400)" name="circle-close" />
    </components.ClearIndicator>
  );
};

const AccountSingleValue = (props: SingleValueProps<Account, false>) => {
  const {
    data,
    selectProps: { isSearchable, menuIsOpen },
  } = props;
  const label = props.data?.address;

  if (isSearchable && menuIsOpen) {
    return null;
  }

  return (
    <components.SingleValue {...props}>
      <AccountCard
        accountAddress={label}
        isShort={props.selectProps.shortenLabel}
        accountName={data?.meta?.name}
        key={label}
      />
    </components.SingleValue>
  );
};

const AccountOption = (props: OptionProps<Account, false>) => {
  return (
    <components.Option {...props}>
      <AccountCard
        accountAddress={props?.label}
        accountName={props?.data?.meta?.name}
        isShort={props.selectProps.shortenLabel}
        key={props?.label}
      />
    </components.Option>
  );
};

export const AccountSelect = (
  props: CreatableProps<Account, false, GroupBase<Account>> & { shortenLabel?: boolean },
) => {
  const { isSearchable, value } = props;

  const [inputValue, setInputValue] = useState<string>();

  const selectRef = useRef<SelectInstance<Account>>(null);

  const menuCloseHandler = useCallback(() => {
    selectRef.current?.blurInput();
  }, []);

  const menuOpenHandler = useCallback(() => {
    if (isSearchable) {
      setInputValue((value as Account)?.address);
    }
  }, [isSearchable, value]);

  const changeHandler = useCallback((account, meta) => {
    props.onChange?.(account, meta);

    if (!account) {
      setInputValue('');
    }
  }, []);

  const changeInputHandler = useCallback((inputValue) => {
    setInputValue(inputValue);
  }, []);

  const formatCreateLabel = useCallback((label) => label, []);

  const getNewOptionData = useCallback(
    (inputValue: string) => ({ address: inputValue } as any),
    [],
  );

  const getOptionLabel = useCallback((account) => account?.address, []);

  return (
    <CreatebleSelect
      {...props}
      theme={theme}
      styles={styles}
      ref={selectRef}
      classNamePrefix="account-select"
      isClearable={props.isClearable ?? true}
      isSearchable={props.isSearchable ?? false}
      inputValue={inputValue}
      components={{
        Option: AccountOption,
        SingleValue: AccountSingleValue,
        IndicatorSeparator: null,
        ClearIndicator,
        DropdownIndicator,
      }}
      shortenLabel={props.shortenLabel}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionLabel}
      getNewOptionData={getNewOptionData}
      formatCreateLabel={formatCreateLabel}
      onMenuOpen={menuOpenHandler}
      onMenuClose={menuCloseHandler}
      onInputChange={changeInputHandler}
      onChange={changeHandler}
    />
  );
};
