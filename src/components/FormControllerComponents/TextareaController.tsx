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
      render={({
        field: { value, ...textareaField },
        fieldState: { error, isTouched },
      }) => (
        <Textarea
          {...textareaField}
          value={value ?? ''}
          {...textareaProps}
          error={isTouched && !!error}
          statusText={isTouched ? error?.message || '' : ''}
        />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
