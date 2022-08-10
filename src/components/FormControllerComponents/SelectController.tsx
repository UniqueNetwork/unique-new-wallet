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
  optionKey,
  ...selectProps
}: SelectControllerProps) => {
  const { control, setValue, register } = useFormContext();
  useEffect(() => {
    register(name, rules);
  }, [name, register, rules]);

  return (
    <Controller
      control={userControl || control}
      render={({ field: { ref, value, onChange, ...selectField } }) => (
        <Select
          {...selectField}
          values={[value]}
          value={
            transform?.input
              ? transform.input(value)
              : (value && value[optionKey || 'id']) ?? ''
          }
          onChange={(val) => {
            const updateValue = transform?.output ? transform.output(val) : val;

            onChange(val);
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
