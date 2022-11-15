import { Toggle, ToggleProps } from '@unique-nft/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

type ToggleControllerProps = BaseControllerProps<
  Omit<ToggleProps, 'checked' | 'onChange'>
>;

export const ToggleController = ({
  name,
  rules,
  label,
  size,
  disabled,
  ...toggleProps
}: ToggleControllerProps) => {
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
          {...toggleProps}
        />
      )}
      name={name}
      rules={rules}
    />
  );
};
