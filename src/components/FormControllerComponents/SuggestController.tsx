import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { SuggestProps, Suggest } from '@unique-nft/ui-kit';

import { Option } from '@app/pages/CreateNFT/types';
import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

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
  const { control, register } = useFormContext();

  // useEffect(() => {
  //   register(name, rules);
  // }, [name, register, rules]);

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
