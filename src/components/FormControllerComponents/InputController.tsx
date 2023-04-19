import { Controller } from 'react-hook-form';

import { BaseControllerProps } from '@app/components/FormControllerComponents/base-type';

import { InputText, InputTextProps } from '../InputText';

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
      render={({
        field: { value, onChange, ...inputField },
        fieldState: { error, isTouched },
      }) => (
        <InputText
          {...inputField}
          value={transform?.input ? transform.input(value) : value ?? ''}
          onChange={(value) => {
            transform?.output ? onChange(transform.output(value)) : onChange(value);
          }}
          {...inputProps}
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
