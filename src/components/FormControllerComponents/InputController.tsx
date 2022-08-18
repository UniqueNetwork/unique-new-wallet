import { Controller } from 'react-hook-form';
import { InputText, InputTextProps } from '@unique-nft/ui-kit';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

type InputControllerProps<
  TInput extends string,
  TOutput,
> = BaseControllerProps<InputTextProps> & {
  transform?: {
    input?: (value: TOutput) => TInput;
    output?: (value: string) => TOutput;
  };
};

export const InputController = <TInput extends string, TOutput>({
  name,
  control,
  rules,
  defaultValue,
  transform,
  ...inputProps
}: InputControllerProps<TInput, TOutput>) => {
  return (
    <Controller
      control={control}
      render={({ field: { value, onChange, ...inputField } }) => (
        <InputText
          {...inputField}
          value={transform?.input ? transform.input(value) : value ?? ''}
          onChange={(value) => {
            transform?.output ? onChange(transform.output(value)) : onChange(value);
          }}
          {...inputProps}
        />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
