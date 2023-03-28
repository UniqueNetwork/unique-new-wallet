import { VFC, useMemo, memo } from 'react';
import { Select } from '@unique-nft/ui-kit';
import { Controller } from 'react-hook-form';

import { FormRow, LabelText } from '@app/pages/components/FormComponents';
import { InputText } from '@app/components';

import { AttributeOption, AttributeType } from './types';
import { FORM_ERRORS } from '../constants';

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
          rules={{
            required: {
              value: !!required,
              message: FORM_ERRORS.REQUIRED_FIELDS,
            },
            pattern: {
              value: /^\S+.*/,
              message: 'Value is not correct',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputText
              clearable
              value={value}
              onChange={onChange}
              onClear={() => onChange('')}
            />
          )}
        />
      )}
      {type === 'select' && (
        <Controller
          name={name}
          rules={{
            required: {
              value: !!required,
              message: FORM_ERRORS.REQUIRED_FIELDS,
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Select value={value?.id} options={options} onChange={onChange} />
          )}
        />
      )}
      {type === 'multiselect' && (
        <Controller
          name={name}
          rules={{
            required: {
              value: !!required,
              message: FORM_ERRORS.REQUIRED_FIELDS,
            },
          }}
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
