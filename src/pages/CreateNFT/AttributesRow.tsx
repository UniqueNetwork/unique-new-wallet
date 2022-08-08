import { VFC, useMemo, useContext, useState } from 'react';
import { InputText, Select, SelectOptionProps } from '@unique-nft/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';

import { TokenField } from '@app/types';
import { FormRow, LabelText } from '@app/pages/components/FormComponents';

import { AttributeOption, AttributeType } from './types';

interface AttributesRowProps {
  label?: string;
  required?: boolean;
  type: AttributeType;
  values: Array<number | string | undefined>;
  name: string;
}

export interface IOption extends SelectOptionProps {
  id: string;
  title: string;
}

export const AttributesRow: VFC<AttributesRowProps> = ({
  type,
  values,
  label,
  required,
  name,
}) => {
  const { control } = useFormContext();

  const options = useMemo(
    () => values.map((val, index) => ({ id: index, title: val })),
    [],
  );

  return (
    <FormRow>
      <LabelText>
        {label}
        {required && '*'}
      </LabelText>
      {type === 'text' && (
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field: { onChange, value } }) => (
            <InputText value={value} onChange={onChange} />
          )}
        />
      )}
      {type === 'select' && (
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field: { onChange, value } }) => (
            <Select value={value?.id} options={options} onChange={onChange} />
          )}
        />
      )}
      {type === 'multiselect' && (
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field: { onChange, value } }) => (
            <Select
              multi
              values={value?.map((val: AttributeOption) => val.id)}
              options={options}
              onChange={onChange}
            />
          )}
        />
      )}
    </FormRow>
  );
};
