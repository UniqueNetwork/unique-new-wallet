import { Controller } from 'react-hook-form';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

import { Textarea, TextareaProps } from '../Textarea';

type InputControllerProps = BaseControllerProps<TextareaProps>;

export const TextareaController = ({
  name,
  control,
  rules,
  defaultValue,
  ...textareaProps
}: InputControllerProps) => {
  return (
    <Controller
      control={control}
      render={({ field: { value, ...textareaField } }) => (
        <Textarea {...textareaField} value={value ?? ''} {...textareaProps} />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
