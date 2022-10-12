import React, { MouseEventHandler, useCallback, useRef, useState } from 'react';
import {
  OptionProps,
  SingleValueProps,
  ClearIndicatorProps,
  DropdownIndicatorProps,
  SelectInstance,
  components,
  GroupBase,
} from 'react-select';
import CreatebleSelect, { CreatableProps } from 'react-select/creatable';
import { Icon, useNotifications } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import { AccountInfo } from '@app/components/AccountSelect/AccountInfo';

import { styles, theme } from './styles';

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
  const { info } = useNotifications();

  const label = props.data?.address;

  //question: should we keep this functionality here
  //maybe will be better to get pages and bussiness components the opportunity to pass onCopy handler
  const onCopyHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    navigator.clipboard.writeText(label || '');

    e.preventDefault();
    e.stopPropagation();

    info('Address copied successfully');
  };

  if (isSearchable && menuIsOpen) {
    return null;
  }

  return (
    <components.SingleValue {...props}>
      <AccountInfo
        canCopy
        key={label}
        address={label}
        name={data?.meta?.name}
        onCopy={onCopyHandler}
      />
    </components.SingleValue>
  );
};

const AccountOption = (props: OptionProps<Account, false>) => {
  return (
    <components.Option {...props}>
      <AccountInfo
        key={props?.label}
        name={props?.data?.meta?.name}
        address={props?.label}
      />
    </components.Option>
  );
};

export const AccountSelect = (
  props: CreatableProps<Account, false, GroupBase<Account>>,
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
