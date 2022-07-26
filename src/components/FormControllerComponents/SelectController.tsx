import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, SelectProps } from '@unique-nft/ui-kit';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

type SelectControllerProps = BaseControllerProps<Omit<SelectProps, 'onChange'>> & {
  transform?: {
    input?: (value: any) => any;
    output?: (value: any) => any;
  };
};

export const SelectController = ({
  name,
  control: userControl,
  rules,
  defaultValue,
  transform,
  ...selectProps
}: SelectControllerProps) => {
  const { control, setValue, register } = useFormContext();

  useEffect(() => {
    register(name, rules);
  }, [name, register, rules]);

  return (
    <Controller
      control={userControl || control}
      render={({ field: { ref, value, ...selectField } }) => (
        <Select
          {...selectField}
          value={transform?.input ? transform.input(value) : value ?? ''}
          onChange={(val) => {
            const updateValue = transform?.output ? transform.output(val) : val;
            setValue(name, updateValue);
            // selectField.onChange(updateValue);
          }}
          {...selectProps}
        />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
