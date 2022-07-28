import { Controller, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';
import { EnumsInput, EnumsInputProps } from '@app/pages/CreateCollection/components';

type EnumsInputControllerProps<T> = BaseControllerProps<
  Omit<EnumsInputProps<T>, 'value'>
>;

export const EnumsInputController = <T,>({
  name,
  control: userControl,
  rules,
  defaultValue,
  ...enumsProps
}: EnumsInputControllerProps<T>) => {
  const { control, register } = useFormContext();

  useEffect(() => {
    register(name, rules);
  }, [name, register, rules]);

  return (
    <Controller
      control={userControl || control}
      render={({ field: { onChange, ...enumsField } }) => (
        <EnumsInput {...enumsField} {...enumsProps} />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
