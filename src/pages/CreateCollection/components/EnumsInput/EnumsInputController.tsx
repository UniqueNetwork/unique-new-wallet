import { Controller, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';
import { EnumsInput, EnumsInputProps } from '@app/pages/CreateCollection/components';

export const EnumsInputController: React.FC<
  BaseControllerProps<EnumsInputProps<string>>
> = ({ name, control: userControl, rules, defaultValue, ...enumsProps }) => {
  const { control, register } = useFormContext();

  useEffect(() => {
    register(name, rules);
  }, [name, register, rules]);

  return (
    <Controller
      control={userControl || control}
      render={({ field: { ...enumsField } }) => (
        <EnumsInput {...enumsField} {...enumsProps} />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
