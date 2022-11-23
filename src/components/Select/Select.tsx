import React, {
  cloneElement,
  isValidElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  AsyncPaginate,
  AsyncPaginateProps,
  LoadOptions,
} from 'react-select-async-paginate';
import {
  ClearIndicatorProps,
  components,
  DropdownIndicatorProps,
  GetOptionLabel,
  GetOptionValue,
  GroupBase,
  OptionProps,
  SelectInstance,
  SingleValueProps,
} from 'react-select';
import { Icon } from '@unique-nft/ui-kit';

import { theme } from './theme';
import { styles } from './styles';

const defaultPage = 0;

export type Option = {
  label?: string;
  value?: string;
} & Record<string, any>;

export type AdditionalSettings = {
  page: number;
};

export type SelectLoadOptions = LoadOptions<
  Option,
  GroupBase<Option>,
  AdditionalSettings
>;

export interface SelectProps
  extends AsyncPaginateProps<Option, GroupBase<Option>, AdditionalSettings, false> {
  render?: ReactNode;
}

export const optionTypeGuard = (option: unknown): option is Option => {
  return (
    !!option &&
    typeof option === 'object' &&
    Object.hasOwn(option, 'label') &&
    Object.hasOwn(option, 'value')
  );
};

const DropdownIndicator = (props: DropdownIndicatorProps<Option, false>) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon size={8} color="var(--color-blue-grey-400)" name="triangle" />
    </components.DropdownIndicator>
  );
};

const CustomOption = (props: OptionProps<Option, false>) => {
  // @ts-ignore
  const { render } = props.selectProps;

  if (isValidElement(render)) {
    return (
      <components.Option {...props}>{cloneElement(render, props.data)}</components.Option>
    );
  }

  return <components.Option {...props} />;
};

const SingleValue = (props: SingleValueProps<Option, false>) => {
  // @ts-ignore
  const { render, isSearchable, menuIsOpen } = props.selectProps;

  if (isSearchable && menuIsOpen) {
    return null;
  }

  if (isValidElement(render)) {
    return (
      <components.SingleValue {...props}>
        {cloneElement(render, props.data)}
      </components.SingleValue>
    );
  }

  return <components.SingleValue {...props} />;
};

const ClearIndicator = (props: ClearIndicatorProps<Option, false>) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon size={19} color="var(--color-blue-grey-400)" name="circle-close" />
    </components.ClearIndicator>
  );
};

export const Select = (props: SelectProps) => {
  const { isSearchable, value } = props;

  const [inputValue, setInputValue] = useState<string>();

  const selectRef = useRef<SelectInstance<Option>>(null);

  const menuCloseHandler = useCallback(() => {
    selectRef.current?.blurInput();
  }, []);

  const menuOpenHandler = useCallback(() => {
    if (optionTypeGuard(value)) {
      const defaultInputValue = value.label ?? selectRef.current?.getValue()[0]?.label;

      if (isSearchable || selectRef.current?.props.isSearchable) {
        setInputValue(defaultInputValue);
      }
    }
  }, [isSearchable, value]);

  const changeHandler = useCallback(
    (value, meta) => {
      if (!value) {
        setInputValue('');
      }

      props.onChange?.(value, meta);
    },
    [selectRef.current?.props.options],
  );

  const changeInputHandler = useCallback((inputValue) => {
    setInputValue(inputValue);
  }, []);

  const getOptionLabel: GetOptionLabel<Option> = useCallback(
    (option: Option) => option.label || '',
    [],
  );

  const getOptionValue: GetOptionValue<Option> = useCallback(
    (option: Option) => option.value || '',
    [],
  );

  return (
    <AsyncPaginate
      isClearable
      isSearchable
      styles={styles}
      theme={theme}
      selectRef={selectRef}
      inputValue={inputValue}
      hideSelectedOptions={false}
      additional={{
        page: defaultPage,
      }}
      components={{
        SingleValue,
        ClearIndicator,
        DropdownIndicator,
        Option: CustomOption,
        IndicatorSeparator: null,
        ...props.components,
      }}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      onMenuOpen={menuOpenHandler}
      onMenuClose={menuCloseHandler}
      onInputChange={changeInputHandler}
      onChange={changeHandler}
      {...props}
    />
  );
};
