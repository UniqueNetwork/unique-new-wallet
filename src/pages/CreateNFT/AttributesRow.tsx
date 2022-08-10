import { VFC, useMemo, memo } from 'react';
import { InputText, Select } from '@unique-nft/ui-kit';
import { Controller } from 'react-hook-form';

import { FormRow, LabelText } from '@app/pages/components/FormComponents';

import { AttributeOption, AttributeType } from './types';

interface AttributesRowProps {
  name: string;
  label?: string;
  required?: boolean;
  type: AttributeType;
  values: Array<number | string | undefined>;
}

const AttributesRowComponent: VFC<AttributesRowProps> = ({
  type,
  values,
  label,
  required,
  name,
}) => {
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
          rules={{ required }}
          render={({ field: { onChange, value } }) => (
            <InputText value={value} onChange={onChange} />
          )}
        />
      )}
      {type === 'select' && (
        <Controller
          name={name}
          rules={{ required }}
          render={({ field: { onChange, value } }) => (
            <Select value={value?.id} options={options} onChange={onChange} />
          )}
        />
      )}
      {type === 'multiselect' && (
        <Controller
          name={name}
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

export const AttributesRow = memo(AttributesRowComponent);
