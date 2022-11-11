import { Toggle, ToggleProps } from '@unique-nft/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

type InputControllerProps = BaseControllerProps<
  Omit<ToggleProps, 'checked' | 'onChange'>
>;

export const ToggleController = ({
  name,
  control: userControl,
  rules,
  label,
}: InputControllerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={userControl || control}
      render={({ field: { value, onChange } }) => (
        <Toggle label={`${label}`} on={value} size="m" onChange={onChange} />
      )}
      name={name}
      rules={rules}
    />
  );
};
