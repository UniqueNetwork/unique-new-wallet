import { Toggle, ToggleProps } from '@unique-nft/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

type InputControllerProps = BaseControllerProps<
  Omit<ToggleProps, 'checked' | 'onChange'>
>;

export const ToggleController = ({
  name,
  rules,
  label,
  size,
  disabled,
}: InputControllerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      render={({ field: { value, onChange } }) => (
        <Toggle
          label={label}
          on={value}
          size={size}
          disabled={disabled}
          onChange={onChange}
        />
      )}
      name={name}
      rules={rules}
    />
  );
};
