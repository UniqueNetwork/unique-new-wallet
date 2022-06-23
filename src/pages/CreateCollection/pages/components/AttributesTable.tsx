import React, { VFC } from 'react';
import {
  InputText,
  TableColumnProps,
  Select,
  SelectOptionProps,
  Button,
} from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { Table } from '@app/components';
import {
  ArtificialAttributeItemType,
  ArtificialFieldRuleType,
  ArtificialFieldType,
  FieldRuleType,
} from '@app/types';

import { EnumsInput } from './EnumsInput';
import trash from '../../../../static/icons/trash.svg'; // TODO: get this icon from ui-kit

interface AttributesTableProps {
  className?: string;
  value: ArtificialAttributeItemType[];
  onChange: (value: ArtificialAttributeItemType[]) => void;
}

interface AttributesColumnsProps {
  onAttributeChange(attribute: ArtificialAttributeItemType): void;
  onRemoveAttributeClick(value: ArtificialAttributeItemType): void;
}

type FieldTypeOption = SelectOptionProps & { key: ArtificialFieldType };
const fieldTypeOptions: FieldTypeOption[] = [
  { key: 'string', value: 'Text' },
  { key: 'enum', value: 'Select' },
  { key: 'repeated', value: 'Multiselect' },
];

type FieldRuleOption = SelectOptionProps & { key: ArtificialFieldRuleType };
const fieldRuleOptions: FieldRuleOption[] = [
  { key: 'optional', value: 'Optional' },
  { key: 'required', value: 'Required' },
];

const getAttributesColumns = ({
  onAttributeChange,
  onRemoveAttributeClick,
}: AttributesColumnsProps): TableColumnProps[] => [
  {
    title: 'Attribute',
    width: '40%',
    field: 'name',
    render(name: string, attribute: ArtificialAttributeItemType) {
      return (
        <InputText
          placeholder="Attribute name"
          value={name}
          onChange={(value: string) => onAttributeChange({ ...attribute, name: value })}
        />
      );
    },
  },
  {
    title: 'Type',
    width: '25%',
    field: 'fieldType',
    render(type: ArtificialFieldType, attribute: ArtificialAttributeItemType) {
      return (
        <Select
          placeholder="Type"
          options={fieldTypeOptions}
          optionKey="key"
          optionValue="value"
          value={type}
          onChange={(option) =>
            onAttributeChange({
              ...attribute,
              fieldType: (option as FieldTypeOption).key,
            })
          }
        />
      );
    },
  },
  {
    title: 'Rule',
    width: '25%',
    field: 'rule',
    render(rule: FieldRuleType, attribute: ArtificialAttributeItemType) {
      return (
        <Select
          placeholder="Rule"
          options={fieldRuleOptions}
          optionKey="key"
          optionValue="value"
          value={rule}
          onChange={(option) =>
            onAttributeChange({ ...attribute, rule: (option as FieldRuleOption).key })
          }
        />
      );
    },
  },
  {
    title: 'Possible values',
    width: '40%',
    field: 'values',
    render(values: string[], attribute: ArtificialAttributeItemType) {
      return (
        <EnumsInput
          isDisabled={attribute.fieldType === 'string'}
          maxSymbols={40}
          setValues={(values: string[]) => onAttributeChange({ ...attribute, values })}
          values={attribute.values}
        />
      );
    },
  },
  {
    title: '',
    width: '56px',
    field: 'id',
    render(id: number, attribute: ArtificialAttributeItemType) {
      return (
        <Button
          title=""
          role="ghost"
          iconLeft={{ file: trash, size: 24 }}
          onClick={() => onRemoveAttributeClick(attribute)}
        />
      );
    },
  },
];

const AttributesTableComponent: VFC<AttributesTableProps> = ({
  className,
  value,
  onChange,
}) => {
  const onAddAttributeItemClick = () => {
    onChange([
      ...value,
      {
        id: value.length++,
        name: '',
        fieldType: 'string',
        rule: 'optional',
        values: [],
      },
    ]);
  };

  const onAttributeChange = (attribute: ArtificialAttributeItemType) => {
    onChange(value.map((item) => (item.id !== attribute.id ? item : attribute)));
  };

  const onRemoveAttributeClick = (attribute: ArtificialAttributeItemType) => {
    onChange(value.filter((item) => item.id !== attribute.id));
  };

  return (
    <div className={className}>
      <Table
        columns={getAttributesColumns({ onAttributeChange, onRemoveAttributeClick })}
        data={value}
      />
      <AddButtonWrapper>
        <Button
          role="ghost"
          title="Add field"
          iconRight={{ name: 'plus', size: 16, color: 'var(--color-primary-500)' }}
          onClick={onAddAttributeItemClick}
        />
      </AddButtonWrapper>
    </div>
  );
};

const AddButtonWrapper = styled.div`
  & > button.unique-button.ghost {
    margin-top: var(--prop-gap);
    background-color: transparent;
    border: none;
    color: var(--color-primary-500);
    padding: 0;
  }
`;

export const AttributesTable = styled(AttributesTableComponent)`
  margin-top: calc(var(--prop-gap) * 1.5);
  .unique-table {
    .unique-table-data-row > div {
      padding: calc(var(--prop-gap) / 4) calc(var(--prop-gap) / 2);
    }
    .unique-input-text {
      padding: 0;
      .input-wrapper {
        padding: 0;
      }
    }
    .unique-select {
      padding: 0;
      width: 100%;
      .select-wrapper {
        padding: 0;
      }
    }
    .unique-button {
      padding: 0;
    }
  }
`;
