import { Controller } from 'react-hook-form';
import { Textarea, TextareaProps } from '@unique-nft/ui-kit';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

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
