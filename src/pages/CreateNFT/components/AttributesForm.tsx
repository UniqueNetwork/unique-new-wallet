import styled from 'styled-components';
import { useMemo } from 'react';

import { AttributeSchema } from '@app/api/graphQL/types';
import { Heading, Icon, InputText, Select } from '@app/components';
import { SelectOptionProps } from '@app/components/types';

import { Attribute, AttributeOption } from '../types';
import { Typography } from '../../../components/Typography/Typography';

type AttributesFormProps = {
  attributes: Attribute[];
  attributesSchema: Record<number, AttributeSchema>;
  onChange(attributes: Attribute[]): void;
};

export const AttributesForm = ({
  attributes,
  attributesSchema,
  onChange,
}: AttributesFormProps) => {
  const onChangeAttribute = (index: number) => (value: Attribute) => {
    if (attributes.length < Object.values(attributesSchema).length) {
      attributes = Array.from({ length: Object.values(attributesSchema).length });
    }
    onChange([...attributes.slice(0, index), value, ...attributes.slice(index + 1)]);
  };

  const schema = Object.values(attributesSchema);

  return (
    <>
      <Heading size="4">Attributes</Heading>
      {schema.length === 0 && (
        <Typography size="s" color="grey-500">
          There are no attributes
        </Typography>
      )}
      {schema.length > 0 && (
        <>
          {schema.map(({ name, optional, isArray, enumValues, type }, index) => {
            return (
              <AttributeRow
                key={`${name}_${index}`}
                name={name._}
                label={name._}
                required={!optional}
                isArray={isArray}
                enumValues={enumValues}
                type={type}
                value={attributes[index]}
                onChange={onChangeAttribute(index)}
              />
            );
          })}
        </>
      )}
    </>
  );
};

const AttributesWrapper = styled.div`
  display: block;
  height: 100%;
  background-color: white;
  flex: 1;

  @media screen and (max-width: 568px) {
    padding-bottom: var(--prop-gap);
  }
`;

interface AttributeRowProps {
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

const AttributeRow = ({
  label,
  required,
  isArray,
  name,
  type,
  enumValues,
  value,
  onChange,
}: AttributeRowProps) => {
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
