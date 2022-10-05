import React, { MouseEventHandler, VFC } from 'react';
import Select, {
  Props,
  OptionProps,
  SingleValueProps,
  ClearIndicatorProps,
  DropdownIndicatorProps,
  StylesConfig,
  components,
} from 'react-select';
import { Icon, useNotifications } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import { AccountInfo } from '@app/components/AccountSelect/AccountInfo';

const styles: StylesConfig<Account, false> = {
  control: (css) => ({
    ...css,
    padding: '9px var(--prop-gap)',
    height: 'calc(var(--prop-gap) * 4)',
    borderColor: 'var(--color-grey-300)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--color-grey-300)',
    },
    '&:focus-within': {
      borderColor: 'var(--color-grey-400)',
    },
  }),
  valueContainer: (css) => ({ ...css, padding: 0 }),
  clearIndicator: (css) => ({
    ...css,
    padding: 0,
    marginRight: 'calc(var(--prop-gap) / 2)',
  }),
  dropdownIndicator: (css) => ({
    ...css,
    padding: 0,
  }),
  placeholder: (css) => ({
    ...css,
    color: 'var(--color-grey-400)',
    fontWeight: 'var(--prop-font-weight)',
    fontFamily: 'var(--prop-font-family)',
    fontSize: 'calc(var(--prop-font-size) + 2px)',
  }),
};

const DropdownIndicator: VFC<DropdownIndicatorProps<Account>> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon size={8} color="var(--color-blue-grey-400)" name="triangle" />
    </components.DropdownIndicator>
  );
};

const ClearIndicator: VFC<ClearIndicatorProps<Account>> = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon size={19} color="var(--color-blue-grey-400)" name="circle-close" />
    </components.ClearIndicator>
  );
};

const AccountSingleValue: VFC<SingleValueProps<Account>> = ({ children, ...props }) => {
  const {
    selectProps: { isSearchable, menuIsOpen },
    data: { address, meta },
  } = props;

  const { info } = useNotifications();

  //question: should we keep this functionality here
  //maybe will be better to get pages and bussiness components the opportunity to pass onCopy handler
  const onCopyHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    navigator.clipboard.writeText(address);

    e.preventDefault();
    e.stopPropagation();

    info('Address copied successfully');
  };

  if (isSearchable && menuIsOpen) {
    return <components.SingleValue {...props}>{children}</components.SingleValue>;
  }
  return (
    <components.SingleValue {...props}>
      <AccountInfo
        canCopy
        key={address}
        name={meta.name}
        address={address}
        onCopy={onCopyHandler}
      />
    </components.SingleValue>
  );
};

const AccountOption: VFC<OptionProps<Account>> = (props) => {
  const {
    data: { address, meta },
  } = props;

  return (
    <components.Option {...props}>
      <AccountInfo address={address} key={address} name={meta.name} />
    </components.Option>
  );
};

export const AccountSelect: VFC<Props<Account>> = (props) => {
  return (
    <Select
      {...props}
      styles={styles}
      getOptionLabel={(account) => account.address}
      getOptionValue={(account) => account.address}
      theme={(th) => ({
        ...th,
        colors: {
          ...th.colors,
          primary: 'var(--color-primary-100)',
          primary25: 'var(--color-primary-100)',
          primary50: 'var(--color-primary-100)',
          primary75: 'var(--color-primary-100)',
        },
      })}
      components={{
        Option: AccountOption,
        SingleValue: AccountSingleValue,
        IndicatorSeparator: null,
        ClearIndicator,
        DropdownIndicator,
      }}
    />
  );
};
