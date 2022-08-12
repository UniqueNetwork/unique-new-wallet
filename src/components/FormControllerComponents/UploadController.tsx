import { Controller, useFormContext } from 'react-hook-form';
import { Upload, UploadProps } from '@unique-nft/ui-kit';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

type InputControllerProps = BaseControllerProps<UploadProps>;

export const UploadController = ({
  name,
  control: userControl,
  rules,
  defaultValue,
  ...uploadProps
}: InputControllerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={userControl || control}
      render={({ field }) => <Upload {...field} {...uploadProps} />}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
