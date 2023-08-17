import { AttributeSchema } from '@unique-nft/schemas';
import { useMemo } from 'react';
import styled from 'styled-components';

import { SelectOptionProps } from '@app/components/types';
import { Icon, InputText, Select } from '@app/components';

import { Typography } from '../../../components/Typography/Typography';
import { Attribute, AttributeOption } from '../types';

interface PropertyRowProps {
  name: string;
  label?: string;
  required?: boolean;
  isArray?: boolean;
  type: AttributeSchema['type'];
  enumValues?: Record<
    number,
    {
      _: string;
    }
  >;
  value: Attribute;
  onChange(value: Attribute): void;
}

export const PropertyRow = ({
  label,
  required,
  isArray,
  name,
  type,
  enumValues,
  value,
  onChange,
}: PropertyRowProps) => {
  const options = useMemo(
    () =>
      Object.values(enumValues || {}).map((val, index) => ({
        id: index.toString(),
        title: val._,
      })) || [],
    [enumValues],
  );

  const onSelect = (value: SelectOptionProps | SelectOptionProps[]) => {
    if (Array.isArray(value)) {
      onChange(value as AttributeOption[]);
      return;
    }
    onChange(value as AttributeOption);
  };

  return (
    <>
      <LabelText>
        {label}
        {required && '*'}
        {(value as { hasDifferentValues: boolean })?.hasDifferentValues && (
          <Icon size={24} name="warning" color="var(--color-primary-500)" />
        )}
      </LabelText>

      {options.length > 0 && (
        <Select
          multi={isArray}
          optionKey="id"
          {...(isArray && !(value as { hasDifferentValues: boolean })?.hasDifferentValues
            ? {
                values: (value as AttributeOption[])?.map<string>(({ id }) =>
                  id.toString(),
                ),
              }
            : {
                value: (value as AttributeOption)?.id?.toString(),
              })}
          options={options}
          onChange={onSelect}
        />
      )}
      {options.length === 0 && (
        <InputText
          clearable
          value={value as string}
          onChange={onChange}
          onClear={() => onChange('')}
        />
      )}
    </>
  );
};

export const LabelText = styled(Typography).attrs({
  color: 'additional-dark',
  size: 'm',
})`
  display: flex !important;
  margin-bottom: var(--prop-gap);
  font-weight: 600;
  align-items: center;
  gap: 8px;
  svg {
    min-width: 24px;
  }
`;
