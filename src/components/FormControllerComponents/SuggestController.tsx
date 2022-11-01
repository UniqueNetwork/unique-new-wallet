import { Controller, useFormContext } from 'react-hook-form';

import { Option } from '@app/pages/CreateNFT/types';
import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';
import { SuggestProps, Suggest } from '@app/components/Suggest';

type SuggestControllerProps = BaseControllerProps<
  Omit<SuggestProps<Option>, 'onChange'>
> & {
  transform?: {
    input?: (value: any) => any;
    output?: (value: any) => any;
  };
};

export const SuggestController = ({
  name,
  control: userControl,
  rules,
  defaultValue,
  transform,
  ...suggestProps
}: SuggestControllerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={userControl || control}
      render={({ field: { value, onChange } }) => (
        <Suggest {...suggestProps} value={value} onChange={onChange} />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
