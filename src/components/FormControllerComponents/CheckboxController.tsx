import { Controller, useFormContext } from 'react-hook-form';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

import { Checkbox, CheckboxProps } from '../Checkbox';

type InputControllerProps = BaseControllerProps<
  Omit<CheckboxProps, 'checked' | 'onChange'> &
    Partial<Pick<CheckboxProps, 'checked' | 'onChange'>>
>;

export const CheckboxController = ({
  name,
  control: userControl,
  rules,
  defaultValue,
  ...checkboxProps
}: InputControllerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={userControl || control}
      render={({ field: { value, ...checkboxField } }) => (
        <Checkbox {...checkboxField} checked={value} {...checkboxProps} />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
