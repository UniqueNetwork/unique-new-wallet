import { Controller, useFormContext } from 'react-hook-form';
import { Textarea, TextareaProps } from '@unique-nft/ui-kit';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

type InputControllerProps = BaseControllerProps<TextareaProps>;

export const TextareaController = ({
  name,
  control: userControl,
  rules,
  defaultValue,
  ...textareaProps
}: InputControllerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={userControl || control}
      render={({ field: { value, ...textareaField } }) => (
        <Textarea {...textareaField} value={value ?? ''} {...textareaProps} />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
